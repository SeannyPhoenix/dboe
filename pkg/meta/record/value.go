package record

import (
	"encoding/json"

	"github.com/google/uuid"
	"github.com/seannyphoenix/binarytime/pkg/binarytime"
)

type Value struct {
	ID uuid.UUID       `json:"id"`
	T  binarytime.Date `json:"t"`
	V  json.RawMessage `json:"v"`
}
