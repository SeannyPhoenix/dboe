package dimension

import (
	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/pkg/meta/dboetype"
	"github.com/seannyphoenix/dboe/pkg/meta/namespace"
)

var Kind = uuid.MustParse("c91ef33c-aa13-408e-b5d1-b91abd09ad3e")

type Definition struct {
	Kind      uuid.UUID           `json:"kind"`
	ID        uuid.UUID           `json:"id"`
	Namespace namespace.Namespace `json:"namespace"`
	Type      uuid.UUID           `json:"type"`
	Unit      uuid.UUID           `json:"unit,omitzero"`
}

func New(id uuid.UUID, ns namespace.Namespace, typ dboetype.Definition, opts ...option) Definition {
	d := Definition{Kind: Kind, ID: id, Namespace: ns, Type: typ.ID}
	for _, opt := range opts {
		opt(&d)
	}
	return d
}

type option func(*Definition)

func WithUnit(unit uuid.UUID) option {
	return func(d *Definition) {
		d.Unit = unit
	}
}
