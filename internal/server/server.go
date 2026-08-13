package server

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/seannyphoenix/dboe/internal/config"
)

func Serve(ctx context.Context, cfg config.Config) error {
	_, err := cfg.LoadDatabase()
	if err != nil {
		return fmt.Errorf("load database: %w", err)
	}
	registerRouter(cfg)

	port := "8080"
	log.Printf("Starting DBOE server on port %s", port)
	return http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
}
