package cmd

import (
	"github.com/seannyphoenix/dboe/internal/server"
	"github.com/spf13/cobra"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start the DBOE server",
	Long:  `Start the DBOE server with the given options.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		return server.Serve()
	},
}
