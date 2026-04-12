package dimension

import (
	"encoding/json"

	"github.com/seannyphoenix/dboe/pkg/key"
)

type Record struct {
	Key       key.Key         `json:"key"`
	Value     json.RawMessage `json:"value,omitzero"` // will be parsed by the type parser
	Ref       []key.Key       `json:"ref,omitzero"`
	CreatedAt int64           `json:"createdAt"`
	DeletedAt int64           `json:"deletedAt,omitzero"`
	Start     string          `json:"start,omitzero"`
	End       string          `json:"end,omitzero"`
}
