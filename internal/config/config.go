package config

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	"github.com/seannyphoenix/dboe/pkg/database"
	"github.com/seannyphoenix/dboe/pkg/record"
	"github.com/seannyphoenix/dboe/pkg/storage/binary"
)

const EnvConfigDir = "DBOE_CONFIG_DIR"

var (
	ErrorConfigNotFound = errors.New("config not found")
)

type Config struct {
	Name         string       `json:"name,omitempty"`
	Root         string       `json:"root"`
	DBFile       string       `json:"dbFile"`
	OutputFormat OutputFormat `json:"outputFormat"`

	DB     database.DB `json:"-"`
	dbFile *os.File
	fileMu sync.RWMutex
}

func Default() *Config {
	return &Config{
		Root:         root(),
		DBFile:       "db.dboe",
		OutputFormat: OutputFormatJSON,
	}
}

func Ensure() (*Config, error) {
	cfg, err := Get()
	if errors.Is(err, ErrorConfigNotFound) {
		err = Save(cfg)
		if err != nil {
			return cfg, fmt.Errorf("save default config: %w", err)
		}
	}
	if err != nil {
		return cfg, fmt.Errorf("get config: %w", err)
	}

	// Ensure database file exists with proper header
	err = cfg.ensureDBFile()
	if err != nil {
		return cfg, fmt.Errorf("ensure database file: %w", err)
	}

	return cfg, nil
}

func (cfg *Config) ensureDBFile() error {
	fp := filepath.Join(cfg.Root, cfg.DBFile)

	// Check if file exists
	_, err := os.Stat(fp)
	if err == nil {
		// File exists, nothing to do
		return nil
	}
	if !os.IsNotExist(err) {
		// Some other error
		return fmt.Errorf("stat database file: %w", err)
	}

	// File doesn't exist, create it with header but no records
	f, err := os.OpenFile(fp, os.O_WRONLY|os.O_CREATE, 0644)
	if err != nil {
		return fmt.Errorf("create database file: %w", err)
	}
	defer f.Close()

	// Write header with empty record list
	err = binary.Write(f, []record.Record{})
	if err != nil {
		return fmt.Errorf("write database header: %w", err)
	}

	return nil
}

func Get() (*Config, error) {
	cfg := Default()

	path := filepath.Join(root(), "config.json")
	b, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return cfg, ErrorConfigNotFound
	}
	if err != nil {
		return cfg, fmt.Errorf("read config file: %w", err)
	}

	err = json.Unmarshal(b, cfg)
	if err != nil {
		return cfg, fmt.Errorf("unmarshal config: %w", err)
	}

	return cfg, nil
}

func (cfg *Config) OpenDBFile() error {
	cfg.fileMu.Lock()
	defer cfg.fileMu.Unlock()

	if cfg.dbFile != nil {
		return nil // already open
	}

	fp := filepath.Join(cfg.Root, cfg.DBFile)
	f, err := os.OpenFile(fp, os.O_RDWR|os.O_APPEND|os.O_CREATE, 0644)
	if err != nil {
		return fmt.Errorf("open database file: %w", err)
	}
	cfg.dbFile = f
	return nil
}

func (cfg *Config) CloseDBFile() error {
	cfg.fileMu.Lock()
	defer cfg.fileMu.Unlock()

	if cfg.dbFile == nil {
		return nil
	}

	err := cfg.dbFile.Close()
	cfg.dbFile = nil
	return err
}

func Save(cfg *Config) error {
	b, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return err
	}

	root := cfg.Root
	if dir := os.Getenv(EnvConfigDir); dir != "" {
		root = dir
	}
	path := filepath.Join(root, "config.json")

	err = os.MkdirAll(root, 0755)
	if err != nil {
		return err
	}

	err = os.WriteFile(path, b, 0644)
	if err != nil {
		return err
	}

	return nil
}

func root() string {
	home, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}

	root := filepath.Join(home, ".dboe")
	if dir := os.Getenv(EnvConfigDir); dir != "" {
		root = dir
	}
	return root
}
