package config

import (
	"fmt"

	"github.com/seannyphoenix/dboe/pkg/database"
	"github.com/seannyphoenix/dboe/pkg/storage/binary"
)

func (cfg *Config) LoadDatabase() (retErr error) {
	if cfg.dbFile == nil {
		return fmt.Errorf("database file is not open")
	}

	rr, err := binary.Read(cfg.dbFile)
	if err != nil {
		return fmt.Errorf("read database file: %w", err)
	}

	cfg.DB = database.LoadDB(rr)
	return nil
}
