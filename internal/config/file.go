package config

type File struct {
	Name string   `json:"name"`
	Type FileType `json:"type"`
}

type FileType string

const (
	FileTypeJSONL  FileType = "jsonl"
	FileTypeBinary FileType = "binary"
)
