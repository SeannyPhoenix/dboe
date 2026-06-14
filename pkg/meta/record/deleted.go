package record

import (
	"github.com/google/uuid"
	"github.com/seannyphoenix/binarytime/pkg/binarytime"
)

type Deleted struct {
	ID uuid.UUID       `json:"id"`
	D  binarytime.Date `json:"d"`
}
