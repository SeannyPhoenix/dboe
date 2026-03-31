package dimension

import "github.com/google/uuid"

var Kind = uuid.MustParse("c91ef33c-aa13-408e-b5d1-b91abd09ad3e")

type Definition struct {
	Kind uuid.UUID `json:"kind"`
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
	Type uuid.UUID `json:"type"`
}

type Record struct {
	ID        uuid.UUID `json:"id"`
	Type      uuid.UUID `json:"type"`
	Timestamp int64     `json:"timestamp"`
	Start     string    `json:"start,omitzero"`
	End       string    `json:"end,omitzero"`
	Deleted   bool      `json:"deleted,omitzero"`
}
