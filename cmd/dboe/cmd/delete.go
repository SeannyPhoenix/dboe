package cmd

import (
	"fmt"

	"github.com/google/uuid"
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
		fmt.Printf("Deleting record with ID %s\n", id)
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
