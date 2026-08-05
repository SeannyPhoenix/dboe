package index

import (
	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/pkg/record"
)

type LinkIndex map[uuid.UUID]map[uuid.UUID]struct{}

func BuildLink(rr []record.Record) LinkIndex {
	index := make(LinkIndex)
	for _, r := range rr {
		if r.Type() == record.TypeLink {
			l, _ := r.Link()
			index.Add(l.A(), l.B())
			index.Add(l.B(), l.A())
		}
	}
	return index
}

func BuildAB(rr []record.Record) LinkIndex {
	index := make(LinkIndex)
	for _, r := range rr {
		if r.Type() == record.TypeLink {
			l, _ := r.Link()
			index.Add(l.A(), l.B())
		}
	}
	return index
}

func BuildBA(rr []record.Record) LinkIndex {
	index := make(LinkIndex)
	for _, r := range rr {
		if r.Type() == record.TypeLink {
			l, _ := r.Link()
			index.Add(l.B(), l.A())
		}
	}
	return index
}

// Add adds a relationship between two UUIDs in the index.
// It returns true if the relationship already exists, false otherwise.
func (i LinkIndex) Add(a, b uuid.UUID) bool {
	if _, ok := i[a]; !ok {
		i[a] = make(map[uuid.UUID]struct{})
	}
	if _, exists := i[a][b]; exists {
		return true
	}
	i[a][b] = struct{}{}
	return false
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

// Get retrieves the set of UUIDs associated with a given UUID in the index.
// It returns nil if the UUID does not exist in the index.
func (i LinkIndex) Get(a uuid.UUID) (map[uuid.UUID]struct{}, bool) {
	m, ok := i[a]
	return m, ok
}
