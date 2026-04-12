package dboetype

import (
	"encoding/json"

	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/pkg/meta/namespace"
)

var Kind = uuid.MustParse("b6652c54-03d8-47a4-acdb-7afe3ff6fb8e")

type Definition struct {
	Kind      uuid.UUID           `json:"kind"`
	ID        uuid.UUID           `json:"id"`
	Namespace namespace.Namespace `json:"namespace"`
	Def       json.RawMessage     `json:"def"` // JSON Schema
}

func New(id uuid.UUID, namespace namespace.Namespace, def json.RawMessage) Definition {
	return Definition{Kind: Kind, ID: id, Namespace: namespace, Def: def}
}
