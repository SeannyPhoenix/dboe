package config

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/seannyphoenix/dboe/pkg/database"
	"github.com/seannyphoenix/dboe/pkg/storage/binary"
)

func (cfg *Config) LoadDatabase() (db database.DB, retErr error) {
	fp := filepath.Join(cfg.Root, cfg.DBFile)
	file, err := os.Open(fp)
	if err != nil {
		return db, fmt.Errorf("open database file: %w", err)
	}
	defer func() {
		err := file.Close()
		if err != nil {
			retErr = errors.Join(retErr, fmt.Errorf("close database file: %w", err))
		}
	}()

	rr, err := binary.Read(file)
	if err != nil {
		return db, fmt.Errorf("read database file: %w", err)
	}

	cfg.DB = database.LoadDB(rr)
	return cfg.DB, nil
}
