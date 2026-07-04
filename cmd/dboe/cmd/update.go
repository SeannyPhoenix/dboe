package cmd

import (
	"fmt"

	"github.com/google/uuid"
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
		fmt.Printf("Updating record with ID %s to new value: %s\n", id, newValue)
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
