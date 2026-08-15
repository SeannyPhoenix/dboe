package cmd

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/internal/config"
	"github.com/seannyphoenix/dboe/pkg/record"
	"github.com/spf13/cobra"
)

var newCmd = &cobra.Command{
	Use:   "new <type> [args]",
	Short: "Create and add a new record to the database",
	Long: `Create and add a new record of the given type to the database.
	
	For example: 
	  dboe new entity
		dboe new value "42"
		dboe new link UUIDA UUIDB`,
	Args: cobra.NoArgs,
}

func init() {
	newCmd.AddCommand(newEntityCmd)
	newCmd.AddCommand(newValueCmd)
	newCmd.AddCommand(newLinkCmd)
}

var newEntityCmd = &cobra.Command{
	Use:   "entity",
	Short: "Create and add a new entity record to the database",
	Long:  `Create and add a new entity record to the database.`,
	Args:  cobra.NoArgs,
	RunE: func(cmd *cobra.Command, args []string) error {
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

		entity := record.NewEntity()
		err = cfg.AddRecord(entity)
		if err != nil {
			return fmt.Errorf("add record: %w", err)
		}

		err = cfg.Print(entity)
		if err != nil {
			return fmt.Errorf("print record: %w", err)
		}

		return nil
	},
}

var newValueCmd = &cobra.Command{
	Use:   "value <value>",
	Short: "Create and add a new value record to the database",
	Long:  `Create and add a new value record to the database.`,
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
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

		value := record.NewValue([]byte(args[0]))
		err = cfg.AddRecord(value)
		if err != nil {
			return fmt.Errorf("add record: %w", err)
		}

		err = cfg.Print(value)
		if err != nil {
			return fmt.Errorf("print record: %w", err)
		}

		return nil
	},
}

var newLinkCmd = &cobra.Command{
	Use:   "link <recordID A> <recordID B>",
	Short: "Create and add a new link record to the database",
	Long:  `Create and add a new link record to the database.`,
	Args:  cobra.ExactArgs(2),
	RunE: func(cmd *cobra.Command, args []string) error {
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

		a, b, err := parseLinkArgs(args)
		if err != nil {
			return err
		}

		link := record.NewLink(a, b)
		err = cfg.AddRecord(link)
		if err != nil {
			return fmt.Errorf("add record: %w", err)
		}

		err = cfg.Print(link)
		if err != nil {
			return fmt.Errorf("print record: %w", err)
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
