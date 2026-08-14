package database

import (
	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/pkg/record"
)

type RecordIndex map[uuid.UUID]record.Record
type LinkIndex map[uuid.UUID]map[uuid.UUID]struct{}

func NewIndex(rr []record.Record) (RecordIndex, LinkIndex) {
	full := map[uuid.UUID][]record.Record{}
	for _, r := range rr {
		if !r.IsValid() {
			continue
		}
		full[r.ID()] = append(full[r.ID()], r)
	}

	ri := make(RecordIndex)
	li := make(LinkIndex)
	for _, records := range full {
		var latest record.Record
		for _, r := range records {
			if r.Timestamp().GreaterThan(latest.Timestamp()) {
				latest = r
			}
		}
		if latest.Type() != record.TypeTombstone {
			ri[latest.ID()] = latest
		}
		if latest.Type() == record.TypeLink {
			l, _ := latest.Link()
			li.Add(l.A(), l.B())
			li.Add(l.B(), l.A())
		}
	}
	return ri, li
}

// Add adds a relationship between two UUIDs in the index.
// It returns true if the relationship is added,
// and false if it already exists.
func (i LinkIndex) Add(a, b uuid.UUID) bool {
	if _, ok := i[a]; !ok {
		i[a] = make(map[uuid.UUID]struct{})
	}
	if _, exists := i[a][b]; exists {
		return false
	}
	i[a][b] = struct{}{}
	return true
}

// Remove removes the relationship between two UUIDs in the index.
// It returns true if the relationship existed and was removed, false otherwise.
func (i LinkIndex) Remove(a, b uuid.UUID) bool {
	if _, ok := i[a]; ok {
		if _, exists := i[a][b]; exists {
			delete(i[a], b)
			if len(i[a]) == 0 {
				delete(i, a)
			}
			return true
		}
	}
	return false
}
