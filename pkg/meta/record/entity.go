package record

import (
	"encoding/json"
	"errors"

	"github.com/google/uuid"
	"github.com/seannyphoenix/binarytime/pkg/binarytime"
)

var ErrorInvalidEntity = errors.New("invalid entity")

type Entity struct {
	ID uuid.UUID       `json:"id"`
	T  binarytime.Date `json:"t"`
}

var (
	_ json.Unmarshaler = (*Entity)(nil)
)

func NewEntity() Entity {
	return Entity{
		ID: uuid.New(),
		T:  binarytime.Now(),
	}
}

func (e *Entity) UnmarshalJSON(data []byte) error {
	var temp = map[string]json.RawMessage{}
	err := json.Unmarshal(data, &temp)
	if err != nil {
		return err
	}
	if len(temp) != 2 {
		return ErrorInvalidEntity
	}

	var id uuid.UUID
	err = json.Unmarshal(temp["id"], &id)
	if err != nil {
		return err
	}
	e.ID = id

	var t binarytime.Date
	err = json.Unmarshal(temp["t"], &t)
	if err != nil {
		return err
	}
	e.T = t

	return nil
}
