package cmd

import (
	"context"

	"github.com/seannyphoenix/dboe/internal/config"
	"github.com/seannyphoenix/dboe/internal/server"
	"github.com/spf13/cobra"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start the DBOE server",
	Long:  `Start the DBOE server with the given options.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		ctx := context.Background()
		cfg, err := config.Get()
		if err != nil {
			return err
		}
		return server.Serve(ctx, cfg)
	},
}
