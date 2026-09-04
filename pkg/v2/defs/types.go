package defs

import (
	"uuid"

	"github.com/seannyphoenix/dboe/pkg/core/serde"
)

type ValueType struct {
	ID    uuid.UUID  `json:"id"`
	Label string     `json:"l"`
	Serde serde.Name `json:"s"`
}

type LinkType struct {
	ID    uuid.UUID `json:"id"`
	Label string    `json:"l"`
}
