package record

import (
	"encoding/json"

	"github.com/google/uuid"
)

type Link struct {
	a uuid.UUID
	b uuid.UUID
}

func (l Link) A() uuid.UUID {
	return l.a
}

func (l Link) B() uuid.UUID {
	return l.b
}

func (l Link) AB() (uuid.UUID, uuid.UUID) {
	return l.a, l.b
}

type linkJSON struct {
	A uuid.UUID `json:"a"`
	B uuid.UUID `json:"b"`
}

func (l Link) MarshalJSON() ([]byte, error) {
	out := linkJSON{
		A: l.a,
		B: l.b,
	}
	return json.Marshal(out)
}

func (l *Link) UnmarshalJSON(data []byte) error {
	var in linkJSON
	if err := json.Unmarshal(data, &in); err != nil {
		return err
	}

	*l = Link{
		a: in.A,
		b: in.B,
	}
	return nil
}
