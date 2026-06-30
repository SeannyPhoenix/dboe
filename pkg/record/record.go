package record

import (
	"encoding/json"

	"github.com/google/uuid"
	"github.com/seannyphoenix/binarytime/pkg/binarytime"
)

// A Record is the basic unit of data in DBOE.
type Record struct {
	// The header fields are present in every record, regardless of type
	t  Type
	id uuid.UUID
	ts binarytime.Date

	// A Value is only present in a Value Record
	v Value

	// A Link is only present in a Link Record
	l Link
}

// Type returns the type of the record.
func (r Record) Type() Type {
	return r.t
}

// ID returns the UUID of the record.
func (r Record) ID() uuid.UUID {
	return r.id
}

// Timestamp returns the timestamp of the record.
func (r Record) Timestamp() binarytime.Date {
	return r.ts
}

// If the record is a Value Record, Value returns
// the Value and true. Otherwise, it returns an
// empty Value and false.
func (r Record) Value() (Value, bool) {
	if r.t != TypeValue {
		return Value{}, false
	}
	return r.v, true
}

// If the record is a Link Record, Link returns
// the Link and true. Otherwise, it returns an
// empty Link and false.
func (r Record) Link() (Link, bool) {
	if r.t != TypeLink {
		return Link{}, false
	}
	return r.l, true
}

func (r Record) IsValid() bool {
	switch r.t {
	case TypeEntity:
		return r.id != uuid.Nil && !r.ts.IsZero() && r.v.data == nil && r.l.a == uuid.Nil && r.l.b == uuid.Nil
	case TypeValue:
		return r.id != uuid.Nil && !r.ts.IsZero() && r.v.data != nil && r.l.a == uuid.Nil && r.l.b == uuid.Nil
	case TypeLink:
		return r.id != uuid.Nil && !r.ts.IsZero() && r.v.data == nil && r.l.a != uuid.Nil && r.l.b != uuid.Nil
	case TypeTombstone:
		return r.id != uuid.Nil && !r.ts.IsZero() && r.v.data == nil && r.l.a == uuid.Nil && r.l.b == uuid.Nil
	default:
		return false
	}
}

type recordJSON struct {
	Type      Type            `json:"t"`
	ID        uuid.UUID       `json:"id"`
	Timestamp binarytime.Date `json:"ts"`
	Value     Value           `json:"v,omitzero"`
	Link      Link            `json:"l,omitzero"`
}

func (r Record) MarshalJSON() ([]byte, error) {
	out := recordJSON{
		Type:      r.t,
		ID:        r.id,
		Timestamp: r.ts,
		Value:     r.v,
		Link:      r.l,
	}
	return json.Marshal(out)
}

func (r *Record) UnmarshalJSON(data []byte) error {
	var in recordJSON
	if err := json.Unmarshal(data, &in); err != nil {
		return err
	}

	*r = RecordFromComponents(
		in.Type,
		in.ID,
		in.Timestamp,
		in.Value,
		in.Link,
	)
	return nil
}
