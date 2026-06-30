package record

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/seannyphoenix/binarytime/pkg/binarytime"
)

// An Entity Record is the base record type.
// It contains no additional data.
func NewEntity() Record {
	return newRecord(TypeEntity)
}

// A Value Record contains a single Value,
// stored as a byte slice. No assumptions are
// made about the content or format of the value.
func NewValue(data []byte) Record {
	r := newRecord(TypeValue)
	r.v = Value{data: data}
	return r
}

// A Link Record contains a Link between two entities.
// They are stored as a pair of UUIDs, `a` and `b`,
// representing the IDs of the two linked entities.
// No assumptions are made about the nature of the link
// or the relationship between the two entities
func NewLink(a, b uuid.UUID) Record {
	r := newRecord(TypeLink)
	r.l = Link{a: a, b: b}
	return r
}

// UpdateValue returns an updated ValueRecord record with the same ID
// as the original record, but with a new value and timestamp.
// If the original record is not a ValueRecord, an error is returned.
func UpdateValue(r Record, data []byte) (Record, error) {
	if r.t != TypeValue {
		return Record{}, fmt.Errorf("record is not a value record")
	}

	u := RecordFromComponents(
		TypeValue,
		r.ID(),
		binarytime.Now(), // Update the timestamp to the current time
		Value{data: data},
		Link{},
	)
	return u, nil
}

// Any record, except an existing Tombstone Record, can be deleted.
// A Tombstone Record has no additional data, even if the
// original record was a Value or Link Record. The Tombstone Record
// retains the original record's ID and has a new timestamp.
func DeleteRecord(r Record) (Record, error) {
	if r.t == TypeTombstone {
		return Record{}, fmt.Errorf("record is already a tombstone")
	}

	t := RecordFromComponents(
		TypeTombstone,
		r.ID(),
		binarytime.Now(),
		Value{},
		Link{},
	)
	return t, nil
}

func newRecord(t Type) Record {
	return RecordFromComponents(
		t,
		uuid.New(),
		binarytime.Now(),
		Value{},
		Link{},
	)
}

// RecordFromComponents creates a new Record
// from the provided components. This is useful
// for reconstructing records from storage or
// other sources.
func RecordFromComponents(
	t Type,
	id uuid.UUID,
	ts binarytime.Date,
	v Value,
	l Link,
) Record {
	return Record{
		t:  t,
		id: id,
		ts: ts,
		v:  v,
		l:  l,
	}
}

// ValueFromBytes creates a new Value
// from the provided byte slice.
func ValueFromBytes(data []byte) Value {
	return Value{data: data}
}

// LinkFromUUIDs creates a new Link
// from the provided UUIDs.
func LinkFromUUIDs(a, b uuid.UUID) Link {
	return Link{a: a, b: b}
}
