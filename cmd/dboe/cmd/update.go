package cmd

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/internal/config"
	"github.com/seannyphoenix/dboe/pkg/record"
	"github.com/spf13/cobra"
)

var updateCmd = &cobra.Command{
	Use:   "update <recordID> <newValue>",
	Short: "Update a value record in the database",
	Long:  `Update a value record in the database.`,
	Args:  cobra.ExactArgs(2),
	RunE: func(cmd *cobra.Command, args []string) error {
		id, err := parseUpdateArgs(args)
		if err != nil {
			return err
		}
		newValue := args[1]

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

		existing, exists := cfg.DB.GetRecordByID(id)
		if !exists {
			return fmt.Errorf("record with ID %s does not exist", id)
		}

		updated, err := record.UpdateValue(existing, []byte(newValue))
		if err != nil {
			return fmt.Errorf("update record: %w", err)
		}

		err = cfg.AddRecord(updated)
		if err != nil {
			return fmt.Errorf("add updated record: %w", err)
		}

		err = cfg.Print(updated)
		if err != nil {
			return fmt.Errorf("print record: %w", err)
		}

		return nil
	},
}

func parseUpdateArgs(args []string) (uuid.UUID, error) {
	id, err := uuid.Parse(args[0])
	if err != nil {
		return uuid.Nil, fmt.Errorf("invalid record ID: %w", err)
	}
	return id, nil
}
