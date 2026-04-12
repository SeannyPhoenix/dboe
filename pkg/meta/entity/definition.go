package entity

import (
	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/pkg/meta/namespace"
)

var Kind = uuid.MustParse("d56b3580-73d9-43b0-bf73-db6eeaa04486")

type Definition struct {
	Kind      uuid.UUID           `json:"kind"`
	ID        uuid.UUID           `json:"id"`
	Namespace namespace.Namespace `json:"namespace"`
}

func New(id uuid.UUID, ns namespace.Namespace) Definition {
	return Definition{Kind: Kind, ID: id, Namespace: ns}
}
