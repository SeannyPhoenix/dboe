package config

import (
	"encoding/json"
	"fmt"
)

type OutputFormat string

const (
	OutputFormatJSON OutputFormat = "json"
)

// Print outputs data to stdout in the configured format (default: JSON)
func (cfg Config) Print(data any) error {
	switch cfg.OutputFormat {
	case OutputFormatJSON:
		return cfg.printJSON(data)
	default:
		return fmt.Errorf("unsupported output format: %s", cfg.OutputFormat)
	}
}

func (cfg Config) printJSON(data any) error {
	b, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal: %w", err)
	}
	fmt.Println(string(b))
	return nil
}
