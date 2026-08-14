package config

import (
	"fmt"

	"github.com/seannyphoenix/dboe/pkg/database"
	"github.com/seannyphoenix/dboe/pkg/storage/binary"
)

func (cfg *Config) LoadDatabase() (db database.DB, retErr error) {
	if cfg.dbFile == nil {
		return db, fmt.Errorf("database file is not open")
	}

	rr, err := binary.Read(cfg.dbFile)
	if err != nil {
		return db, fmt.Errorf("read database file: %w", err)
	}

	cfg.DB = database.LoadDB(rr)
	return cfg.DB, nil
}
