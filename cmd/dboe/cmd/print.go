package cmd

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/seannyphoenix/dboe/internal/config"
	"github.com/seannyphoenix/dboe/pkg/storage/binary"
	"github.com/spf13/cobra"
)

var printCmd = &cobra.Command{
	Use:   "print",
	Short: "Print the database contents",
	Long:  `Print the database contents.`,
	Args:  cobra.NoArgs,
	RunE: func(cmd *cobra.Command, args []string) error {
		cfg, err := config.Get()
		if err != nil {
			return fmt.Errorf("get config: %w", err)
		}
		for _, f := range cfg.Files {
			if f.Type == config.FileTypeBinary {
				fp := filepath.Join(cfg.Root, f.Name)
				f, err := os.Open(fp)
				if err != nil {
					return fmt.Errorf("open binary file: %w", err)
				}
				rr, err := binary.Read(f)
				if err != nil {
					return fmt.Errorf("read binary file: %w", err)
				}
				for _, r := range rr {
					b, err := json.Marshal(r)
					if err != nil {
						return fmt.Errorf("marshal record: %w", err)
					}
					fmt.Println(string(b))
				}
			}
		}
		return nil
	},
}
