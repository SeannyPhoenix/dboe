package cmd

import (
	"io"
	"testing"
)

const validUUID = "867ac1a7-9067-4051-b632-089fdcf44303"

func executeRoot(t *testing.T, args []string) error {
	t.Helper()

	rootCmd.SetOut(io.Discard)
	rootCmd.SetErr(io.Discard)
	rootCmd.SilenceErrors = true
	rootCmd.SilenceUsage = true
	rootCmd.SetArgs(args)
	_, err := rootCmd.ExecuteC()
	return err
}
