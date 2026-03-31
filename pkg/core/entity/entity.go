package entity

import "github.com/google/uuid"

var Kind = uuid.MustParse("d56b3580-73d9-43b0-bf73-db6eeaa04486")

type Definition struct {
	Kind uuid.UUID `json:"kind"`
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

type Record struct {
	ID        uuid.UUID `json:"id"`
	Type      uuid.UUID `json:"type"`
	Timestamp int64     `json:"timestamp"`
	Deleted   bool      `json:"deleted,omitzero"`
}
