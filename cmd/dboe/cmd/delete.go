package cmd

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/internal/config"
	"github.com/seannyphoenix/dboe/pkg/record"
	"github.com/spf13/cobra"
)

var deleteCmd = &cobra.Command{
	Use:   "delete <recordID>",
	Short: "Delete a record from the database",
	Long:  `Delete a record from the database.`,
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		id, err := parseDeleteArgs(args)
		if err != nil {
			return err
		}

		cfg, err := config.Get()
		if err != nil {
			return fmt.Errorf("get config: %w", err)
		}

		db, err := cfg.LoadDatabase()
		if err != nil {
			return fmt.Errorf("load database: %w", err)
		}

		rec, exists := db.GetRecordByID(id)
		if !exists {
			return fmt.Errorf("record with ID %s not found", id)
		}

		deleted, err := record.DeleteRecord(rec)
		if err != nil {
			return fmt.Errorf("create delete record: %w", err)
		}

		err = cfg.AddRecord(deleted)
		if err != nil {
			return fmt.Errorf("add delete record: %w", err)
		}

		err = cfg.Print(deleted)
		if err != nil {
			return fmt.Errorf("print record: %w", err)
		}

		return nil
	},
}

func parseDeleteArgs(args []string) (uuid.UUID, error) {
	id, err := uuid.Parse(args[0])
	if err != nil {
		return uuid.Nil, fmt.Errorf("invalid record ID: %w", err)
	}
	return id, nil
}
