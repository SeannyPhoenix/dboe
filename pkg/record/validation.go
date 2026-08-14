package record

import "github.com/google/uuid"

func (r Record) IsValid() bool {
	return r.hasValidType() && r.hasValidID() && r.hasValidTimestamp() && r.hasValidValue() && r.hasValidLink()
}

func (r Record) hasValidType() bool {
	return r.t == TypeEntity || r.t == TypeValue || r.t == TypeLink || r.t == TypeTombstone
}

func (r Record) hasValidID() bool {
	return r.id != uuid.Nil
}

func (r Record) hasValidTimestamp() bool {
	return !r.ts.IsZero()
}

func (r Record) hasValidValue() bool {
	if r.Type() == TypeValue {
		return r.v.data != nil
	}
	return r.v.data == nil
}

func (r Record) hasValidLink() bool {
	if r.Type() == TypeLink {
		return r.l.a != uuid.Nil && r.l.b != uuid.Nil && r.l.a != r.l.b
	}
	return r.l.a == uuid.Nil && r.l.b == uuid.Nil
}
