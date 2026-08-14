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

		db, err := cfg.LoadDatabase()
		if err != nil {
			return fmt.Errorf("load database: %w", err)
		}

		err = cfg.Print(db)
		if err != nil {
			return fmt.Errorf("print record: %w", err)
		}

		return nil
	},
}
