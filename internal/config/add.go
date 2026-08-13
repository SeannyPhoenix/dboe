package config

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/seannyphoenix/dboe/pkg/record"
	"github.com/seannyphoenix/dboe/pkg/storage/binary"
)

func (cfg Config) AddRecord(r record.Record) (retErr error) {
	fp := filepath.Join(cfg.Root, cfg.DBFile)
	f, err := os.OpenFile(fp, os.O_WRONLY|os.O_APPEND, 0644)
	if errors.Is(err, os.ErrNotExist) {
		f, err := os.OpenFile(fp, os.O_WRONLY|os.O_CREATE, 0644)
		if err != nil {
			return fmt.Errorf("create database file: %w", err)
		}
		defer func() {
			err := f.Close()
			if err != nil {
				retErr = errors.Join(retErr, fmt.Errorf("close database file: %w", err))
			}
		}()

		err = binary.Write(f, []record.Record{r})
		if err != nil {
			return fmt.Errorf("write record: %w", err)
		}
		return nil
	}
	if err != nil {
		return fmt.Errorf("open database file: %w", err)
	}
	defer func() {
		err := f.Close()
		if err != nil {
			retErr = errors.Join(retErr, fmt.Errorf("close database file: %w", err))
		}
	}()

	err = binary.Add(f, r)
	if err != nil {
		return fmt.Errorf("add record: %w", err)
	}
	return nil
}
