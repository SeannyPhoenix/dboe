package cmd

// import (
// 	"fmt"

// 	"github.com/google/uuid"
// 	"github.com/spf13/cobra"
// )

// var readCmd = &cobra.Command{
// 	Use:   "read",
// 	Short: "Read a record from the database",
// 	Long:  `Read a record from the database.`,
// 	Args:  cobra.ExactArgs(1),
// 	RunE: func(cmd *cobra.Command, args []string) error {
// 		id, err := parseReadArgs(args)
// 		if err != nil {
// 			return err
// 		}
// 		return nil
// 	},
// }

// func parseReadArgs(args []string) (uuid.UUID, error) {
// 	id, err := uuid.Parse(args[0])
// 	if err != nil {
// 		return uuid.Nil, fmt.Errorf("invalid record ID: %w", err)
// 	}
// 	return id, nil
// }
