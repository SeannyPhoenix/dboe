package index

import (
	"time"
	"uuid"

	"github.com/seannyphoenix/dboe/pkg/v2/defs"
	mmap "go.foxforensics.eu/go-mmap"
)

type Index struct {
	Changeset EntityIndex
	Metadata  mmap.MMap
	Links     mmap.MMap
}

type EntityID uuid.UUID
type LinkID uuid.UUID // v7
type TypeID uuid.UUID
type ValueID uuid.UUID

type LinkIndexRecord struct {
	LinkID LinkID
	To     EntityID
}

type Tombstone struct {
	LinkID    LinkID
	Timestamp time.Time
}

type TombstoneIndexRecord map[LinkID]*Tombstone

type EntityIndexRecord map[TypeID]struct {
	AtoB       []LinkIndexRecord
	BtoA       []LinkIndexRecord
	Tombstones TombstoneIndexRecord
	Values     []ValueID
}

type EntityIndex map[EntityID]EntityIndexRecord

func NewIndex(metadataFile string, linksFile string) (Index, error) {
	return Index{}, nil
}

// get links to entity

func GetEntityLinks(index Index, entityID EntityID) []defs.Link {
	var links []defs.Link

	// read fileLinks
	// read changsetLinks
	// merge fileLinks and changsetLinks into links
	//   drop tombstoned links
	// return links

	return links
}

type TypeIndexRecord map[TypeID]struct {
	AtoB       []LinkIndexRecord
	BtoA       []LinkIndexRecord
	Tombstones TombstoneIndexRecord
	Values     []ValueID
}
