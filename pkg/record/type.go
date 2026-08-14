package record

// There are four types of records:
// Entity, Value, Link, and Tombstone.
type Type byte

const (
	TypeUnknown = Type(iota)
	TypeEntity
	TypeValue
	TypeLink
	TypeTombstone
)
