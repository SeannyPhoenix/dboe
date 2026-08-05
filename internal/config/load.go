package config

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/seannyphoenix/dboe/pkg/database"
	"github.com/seannyphoenix/dboe/pkg/record"
	"github.com/seannyphoenix/dboe/pkg/storage/binary"
)

// In internal/config/config.go
func (cfg Config) LoadDatabase() (db database.DB, retErr error) {
	var rr []record.Record
	for _, f := range cfg.Files {
		if f.Type == FileTypeBinary {
			fp := filepath.Join(cfg.Root, f.Name)
			file, err := os.Open(fp)
			if err != nil {
				return db, fmt.Errorf("open binary file: %w", err)
			}
			defer func() {
				err := file.Close()
				if err != nil {
					retErr = errors.Join(retErr, fmt.Errorf("close binary file: %w", err))
				}
			}()
			rr, err = binary.Read(file)
			if err != nil {
				return db, fmt.Errorf("read binary file: %w", err)
			}
			break
		}
	}
	db = database.LoadDB(rr)
	return db, nil
}
