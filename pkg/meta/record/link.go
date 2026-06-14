package record

import (
	"github.com/google/uuid"
	"github.com/seannyphoenix/binarytime/pkg/binarytime"
)

type Link struct {
	ID uuid.UUID       `json:"id"`
	T  binarytime.Date `json:"t"`
	A  uuid.UUID       `json:"a"`
	B  uuid.UUID       `json:"b"`
}
