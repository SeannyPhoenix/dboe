package index

import (
	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/pkg/record"
)

type RecordIndex map[uuid.UUID]record.Record

func BuildRecord(rr []record.Record) RecordIndex {
	index := make(RecordIndex)
	for _, r := range rr {
		e, ok := index[r.ID()]
		if ok {
			if r.Timestamp().GreaterThan(e.Timestamp()) {
				index[r.ID()] = r
			}
		} else {
			index[r.ID()] = r
		}
	}
	return index
}
