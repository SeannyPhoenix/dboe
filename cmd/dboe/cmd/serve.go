package cmd

import "github.com/spf13/cobra"

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start the DBOE server",
	Long:  `Start the DBOE server with the given options.`,
}
