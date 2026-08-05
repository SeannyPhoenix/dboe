package database

import (
	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/pkg/index"
	"github.com/seannyphoenix/dboe/pkg/record"
)

type DB struct {
	Links   index.LinkIndex
	Records index.RecordIndex
}

func LoadDB(rr []record.Record) DB {
	db := DB{
		Links:   index.BuildLink(rr),
		Records: index.BuildRecord(rr),
	}

	return db
}

func (db DB) GetRecordByID(id uuid.UUID) (record.Record, bool) {
	rec, ok := db.Records[id]
	return rec, ok
}

func (db DB) GetLinksFrom(id uuid.UUID) ([]uuid.UUID, bool) {
	links, ok := db.Links[id]

	ids := make([]uuid.UUID, len(links))
	var i int
	for id := range links {
		ids[i] = id
		i++
	}
	return ids, ok
}
