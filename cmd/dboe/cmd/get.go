package cmd

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/internal/config"
	"github.com/spf13/cobra"
)

var getCmd = &cobra.Command{
	Use:   "get <recordID>",
	Short: "Get a record from the database",
	Long:  `Get a record from the database.`,
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		id, err := parseGetArgs(args)
		if err != nil {
			return err
		}

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

		record, exists := cfg.DB.GetRecordByID(id)
		if !exists {
			return fmt.Errorf("record with ID %s not found", id)
		}

		err = cfg.Print(record)
		if err != nil {
			return fmt.Errorf("print record: %w", err)
		}

		return nil
	},
}

func parseGetArgs(args []string) (uuid.UUID, error) {
	id, err := uuid.Parse(args[0])
	if err != nil {
		return uuid.Nil, fmt.Errorf("invalid record ID: %w", err)
	}
	return id, nil
}
