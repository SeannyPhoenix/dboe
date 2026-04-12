package entity

import (
	"time"

	"github.com/seannyphoenix/dboe/pkg/key"
)

type Record struct {
	Key       key.Key `json:"key"`
	CreatedAt int64   `json:"createdAt"`
	DeletedAt int64   `json:"deletedAt,omitzero"`
}

func NewRecord(def Definition) Record {
	return Record{
		Key:       key.MustNew(def.ID),
		CreatedAt: time.Now().Unix(),
	}
}
