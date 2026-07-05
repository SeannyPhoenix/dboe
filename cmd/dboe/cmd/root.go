/*
Copyright © 2026 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"context"
	"fmt"
	"os"

	"github.com/seannyphoenix/dboe/internal/config"
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:     "dboe <command>",
	Short:   "DBOE Database Manager",
	Long:    `Manage a DBOE database. Read, add, update, and delete data with the CLI.`,
	Version: "0.1.0",
	PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
		_, err := config.Ensure()
		if err != nil {
			return fmt.Errorf("ensure config: %w", err)
		}
		return nil
	},
}

func Execute() {
	ctx := context.Background()
	err := rootCmd.ExecuteContext(ctx)
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	rootCmd.AddCommand(addCmd)
	rootCmd.AddCommand(deleteCmd)
	rootCmd.AddCommand(getCmd)
	rootCmd.AddCommand(printCmd)
	rootCmd.AddCommand(updateCmd)
}
