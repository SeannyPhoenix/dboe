package cmd

import (
	"fmt"

	"github.com/seannyphoenix/dboe/internal/server"
	"github.com/spf13/cobra"
)

var servePort int

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start the DBOE server",
	Long:  `Start the DBOE server with the given options.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		port, err := parseServePort(servePort)
		if err != nil {
			return err
		}

		return server.Serve(port)
	},
}

func init() {
	serveCmd.Flags().IntVar(&servePort, "port", 8080, "Port to bind the HTTP server to")
}

func parseServePort(port int) (int, error) {
	if port < 1 || port > 65535 {
		return 0, fmt.Errorf("invalid port %d: must be between 1 and 65535", port)
	}

	return port, nil
}
