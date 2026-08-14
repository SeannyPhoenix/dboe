package database

import (
	"encoding/json"
	"errors"

	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/pkg/record"
)

type DB struct {
	records RecordIndex
	links   LinkIndex
}

func LoadDB(rr []record.Record) DB {
	ri, li := NewIndex(rr)
	db := DB{
		records: ri,
		links:   li,
	}

	return db
}

func (db DB) GetRecordByID(id uuid.UUID) (record.Record, bool) {
	rec, ok := db.records[id]
	return rec, ok
}

func (db DB) GetLinksFrom(id uuid.UUID) ([]uuid.UUID, bool) {
	links, ok := db.links[id]

	ids := make([]uuid.UUID, len(links))
	var i int
	for id := range links {
		ids[i] = id
		i++
	}
	return ids, ok
}

var (
	ErrInvalidRecord                             = errors.New("invalid record")
	ErrAttemptedToDeleteNonExistentRecord        = errors.New("attempted to delete a record that does not exist")
	ErrAttemptedToDeleteRecordWithOlderTimestamp = errors.New("attempted to delete a record with an older timestamp than the existing record")
	ErrFailedToRemoveLinkFromIndex               = errors.New("failed to remove link from index")
	ErrAttemptedToAddRecordWithOlderTimestamp    = errors.New("attempted to add a record with an older timestamp than the existing record")
	ErrFailedToAddLinkToIndex                    = errors.New("failed to add link to index")
)

func (db *DB) AddRecord(r record.Record) error {
	if !r.IsValid() {
		return ErrInvalidRecord
	}

	switch r.Type() {
	case record.TypeTombstone:
		curr, exists := db.records[r.ID()]
		if !exists {
			return ErrAttemptedToDeleteNonExistentRecord
		}
		if curr.Timestamp().GreaterThan(r.Timestamp()) {
			return ErrAttemptedToDeleteRecordWithOlderTimestamp
		}
		delete(db.records, r.ID())
		if curr.Type() == record.TypeLink {
			l, _ := curr.Link()
			abOK := db.links.Remove(l.A(), l.B())
			baOK := db.links.Remove(l.B(), l.A())
			if !abOK || !baOK {
				return ErrFailedToRemoveLinkFromIndex
			}
		}
	case record.TypeEntity, record.TypeValue, record.TypeLink:
		curr, exists := db.records[r.ID()]
		if exists && curr.Timestamp().GreaterThan(r.Timestamp()) {
			return ErrAttemptedToAddRecordWithOlderTimestamp
		}
		db.records[r.ID()] = r
		if r.Type() == record.TypeLink {
			l, _ := r.Link()
			abOK := db.links.Add(l.A(), l.B())
			baOK := db.links.Add(l.B(), l.A())
			if !abOK || !baOK {
				return ErrFailedToAddLinkToIndex
			}
		}
	}
	return nil
}

func (db DB) MarshalJSON() ([]byte, error) {
	rr := make([]record.Record, 0, len(db.records))
	for _, r := range db.records {
		rr = append(rr, r)
	}

	return json.Marshal(rr)
}
