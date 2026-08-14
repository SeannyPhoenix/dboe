package cmd

import (
	"fmt"

	"github.com/seannyphoenix/dboe/internal/config"
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

		err = cfg.OpenDBFile()
		if err != nil {
			return fmt.Errorf("open database file: %w", err)
		}
		defer func() {
			err := cfg.CloseDBFile()
			if err != nil {
				fmt.Printf("close database file: %v\n", err)
			}
		}()

		err = cfg.LoadDatabase()
		if err != nil {
			return fmt.Errorf("load database: %w", err)
		}

		err = cfg.Print(cfg.DB)
		if err != nil {
			return fmt.Errorf("print record: %w", err)
		}

		return nil
	},
}
