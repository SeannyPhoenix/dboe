package dboetype

import "github.com/google/uuid"

var Kind = uuid.MustParse("b6652c54-03d8-47a4-acdb-7afe3ff6fb8e")

type Type struct {
	Kind uuid.UUID `json:"kind"`
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}
