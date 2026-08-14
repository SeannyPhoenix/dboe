package server

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/seannyphoenix/dboe/internal/config"
)

func Serve(port int) error {
	log.Print("Reading config\n")
	cfg, err := config.Ensure()
	if err != nil {
		return fmt.Errorf("ensure config: %w", err)
	}

	log.Print("Opening db file\n")
	err = cfg.OpenDBFile()
	if err != nil {
		return fmt.Errorf("open database file: %w", err)
	}
	defer func() {
		log.Printf("Closing db file\n")
		err := cfg.CloseDBFile()
		if err != nil {
			log.Printf("close database file: %v", err)
		}
	}()

	log.Print("Loading database\n")
	err = cfg.LoadDatabase()
	if err != nil {
		return fmt.Errorf("load database: %w", err)
	}

	log.Printf("Registering routes")
	handler := registerRoutes(cfg)

	srv := &http.Server{Addr: fmt.Sprintf(":%d", port), Handler: handler}
	errCh := make(chan error, 1)

	go func() {
		log.Printf("Starting DBOE server on port %d", port)
		err := srv.ListenAndServe()
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- fmt.Errorf("start server: %w", err)
			return
		}
		errCh <- nil
	}()

	sigCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	select {
	case err := <-errCh:
		if err != nil {
			return err
		}
		return nil
	case <-sigCtx.Done():
		log.Print("Shutdown signal received")
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		err := srv.Shutdown(shutdownCtx)
		if err != nil {
			return fmt.Errorf("shutdown server: %w", err)
		}

		err = <-errCh
		if err != nil {
			return err
		}
		return nil
	}
}
