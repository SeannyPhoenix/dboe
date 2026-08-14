package config

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/seannyphoenix/dboe/pkg/record"
	"github.com/seannyphoenix/dboe/pkg/storage/binary"
)

func (cfg *Config) AddRecord(r record.Record) error {
	cfg.fileMu.Lock()
	defer cfg.fileMu.Unlock()

	var f *os.File
	var err error

	// If file is already open (server mode), use it
	if cfg.dbFile != nil {
		f = cfg.dbFile
	} else {
		// Otherwise, open for this operation (CLI mode)
		fp := filepath.Join(cfg.Root, cfg.DBFile)

		// Open the file - it must already exist (created by Ensure())
		f, err = os.OpenFile(fp, os.O_WRONLY|os.O_APPEND, 0644)
		if err != nil {
			return fmt.Errorf("open database file: %w", err)
		}
		defer f.Close()
	}

	// Write to file
	err = binary.Add(f, r)
	if err != nil {
		return fmt.Errorf("add record to file: %w", err)
	}

	// Update in-memory database
	err = cfg.DB.AddRecord(r)
	if err != nil {
		return fmt.Errorf("add record to database: %w", err)
	}

	return nil
}
