package defs

import (
	"uuid"

	"github.com/seannyphoenix/binarytime/pkg/binarytime"
)

type Value struct {
	ID        uuid.UUID       `json:"id"`
	Type      uuid.UUID       `json:"t"`
	Entity    uuid.UUID       `json:"p"`
	Timestamp binarytime.Date `json:"ts"`
	Data      []byte          `json:"v"`
}

type Link struct {
	ID        uuid.UUID       `json:"id"`
	Type      uuid.UUID       `json:"t"`
	Timestamp binarytime.Date `json:"ts"`
	A         uuid.UUID       `json:"a"`
	B         uuid.UUID       `json:"b"`
}

type Tombstone struct {
	ID        uuid.UUID       `json:"id"`
	Timestamp binarytime.Date `json:"ts"`
}
