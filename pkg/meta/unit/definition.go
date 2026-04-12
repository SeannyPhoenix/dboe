package unit

import (
	"github.com/google/uuid"
	"github.com/seannyphoenix/binarytime/pkg/fixed128"
	"github.com/seannyphoenix/dboe/pkg/meta/namespace"
)

var Kind = uuid.MustParse("45d826f5-d13e-47bd-be8f-58200f478d23")

type Definition struct {
	Kind      uuid.UUID           `json:"kind"`
	ID        uuid.UUID           `json:"id"`
	Namespace namespace.Namespace `json:"namespace"`
	Value     fixed128.Fixed128   `json:"value,omitzero"`
}

func New(id uuid.UUID, namespace namespace.Namespace, value fixed128.Fixed128) Definition {
	return Definition{Kind: Kind, ID: id, Namespace: namespace, Value: value}
}
