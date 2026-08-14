package cmd

import (
	"io"
	"path/filepath"
	"testing"

	"github.com/seannyphoenix/dboe/internal/config"
)

const validUUID = "867ac1a7-9067-4051-b632-089fdcf44303"

func executeRoot(t *testing.T, args []string) error {
	t.Helper()

	configDir := filepath.Join(t.TempDir(), ".dboe")
	t.Setenv(config.EnvConfigDir, configDir)

	rootCmd.SetOut(io.Discard)
	rootCmd.SetErr(io.Discard)
	rootCmd.SilenceErrors = true
	rootCmd.SilenceUsage = true
	rootCmd.SetArgs(args)
	_, err := rootCmd.ExecuteC()
	return err
}
