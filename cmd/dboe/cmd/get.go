package cmd

import (
	"fmt"

	"github.com/google/uuid"
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
		fmt.Printf("Getting record with ID %s\n", id)
		return nil
	},
}

func parseGetArgs(args []string) (uuid.UUID, error) {
	id, err := uuid.Parse(args[0])
	if err != nil {
		return uuid.Nil, fmt.Errorf("invalid record ID: %v", err)
	}
	return id, nil
}
