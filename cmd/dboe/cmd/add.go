/*
Copyright © 2026 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/internal/config"
	"github.com/seannyphoenix/dboe/pkg/record"
	"github.com/spf13/cobra"
)

var addCmd = &cobra.Command{
	Use:   "add <type> [args]",
	Short: "Add a record to the database",
	Long: `Add a record of the given type to the database.
	
	For example: 
	  dboe add entity
		dboe add value "42"
		dboe add link UUIDA UUIDB`,
	RunE: func(cmd *cobra.Command, args []string) error {
		if len(args) < 1 {
			return fmt.Errorf("missing record type")
		}
		return fmt.Errorf("unknown record type %s", args[0])
	},
}

func init() {
	addCmd.AddCommand(addEntityCmd)
	addCmd.AddCommand(addValueCmd)
	addCmd.AddCommand(addLinkCmd)
}

var addEntityCmd = &cobra.Command{
	Use:   "entity",
	Short: "Add an entity record to the database",
	Long:  `Add an entity record to the database.`,
	Args:  cobra.NoArgs,
	RunE: func(cmd *cobra.Command, args []string) error {
		cfg, err := config.Get()
		if err != nil {
			return fmt.Errorf("get config: %w", err)
		}

		r := record.NewEntity()
		err = cfg.AddRecord(r)
		if err != nil {
			return fmt.Errorf("add record: %w", err)
		}

		return nil
	},
}

var addValueCmd = &cobra.Command{
	Use:   "value <value>",
	Short: "Add a value record to the database",
	Long:  `Add a value record to the database.`,
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		cfg, err := config.Get()
		if err != nil {
			return fmt.Errorf("get config: %w", err)
		}

		r := record.NewValue([]byte(args[0]))
		err = cfg.AddRecord(r)
		if err != nil {
			return fmt.Errorf("add record: %w", err)
		}

		return nil
	},
}

var addLinkCmd = &cobra.Command{
	Use:   "link <recordID A> <recordID B>",
	Short: "Add a link record to the database",
	Long:  `Add a link record to the database.`,
	Args:  cobra.ExactArgs(2),
	RunE: func(cmd *cobra.Command, args []string) error {
		cfg, err := config.Get()
		if err != nil {
			return fmt.Errorf("get config: %w", err)
		}

		a, b, err := parseLinkArgs(args)
		if err != nil {
			return err
		}
		r := record.NewLink(a, b)

		err = cfg.AddRecord(r)
		if err != nil {
			return fmt.Errorf("add record: %w", err)
		}
		return nil
	},
}

func parseLinkArgs(args []string) (uuid.UUID, uuid.UUID, error) {
	var a, b uuid.UUID
	a, err := uuid.Parse(args[0])
	if err != nil {
		return a, b, fmt.Errorf("parse uuid A: %w", err)
	}
	b, err = uuid.Parse(args[1])
	if err != nil {
		return a, b, fmt.Errorf("parse uuid B: %w", err)
	}
	return a, b, nil
}
