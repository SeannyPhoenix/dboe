package config

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/seannyphoenix/dboe/pkg/database"
)

const EnvConfigDir = "DBOE_CONFIG_DIR"

var (
	ErrorConfigNotFound = errors.New("config not found")
)

type Config struct {
	Name         string       `json:"name,omitempty"`
	Root         string       `json:"root"`
	Files        []File       `json:"files"`
	OutputFormat OutputFormat `json:"outputFormat"`

	DB database.DB
}

func Default() Config {
	return Config{
		Root: root(),
		Files: []File{
			{"db.dboe", FileTypeBinary},
			{"db.jsonl", FileTypeJSONL},
		},
		OutputFormat: OutputFormatJSON,
	}
}

func Ensure() (Config, error) {
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

	return cfg, nil
}

func Get() (Config, error) {
	cfg := Default()

	path := filepath.Join(root(), "config.json")
	b, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return cfg, ErrorConfigNotFound
	}
	if err != nil {
		return cfg, fmt.Errorf("read config file: %w", err)
	}

	err = json.Unmarshal(b, &cfg)
	if err != nil {
		return cfg, fmt.Errorf("unmarshal config: %w", err)
	}

	return cfg, nil
}

func Save(cfg Config) error {
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
