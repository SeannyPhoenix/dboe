package binary

import (
	"encoding/binary"
	"fmt"
	"io"
	"math"

	"github.com/seannyphoenix/dboe/pkg/record"
)

func Write(w io.Writer, rr []record.Record) error {
	h := fileHeader{
		version: Latest,
	}

	b, err := h.MarshalBinary()
	if err != nil {
		return fmt.Errorf("marshal header: %w", err)
	}

	if _, err := w.Write(b); err != nil {
		return fmt.Errorf("write header: %w", err)
	}

	for _, r := range rr {
		if err := writeRecord(w, r); err != nil {
			return fmt.Errorf("write record: %w", err)
		}
	}

	return nil
}

func writeRecord(w io.Writer, r record.Record) error {
	rh := recordHeader{
		t:  r.Type(),
		id: r.ID(),
		ts: r.Timestamp(),
	}

	rhb, err := rh.MarshalBinary()
	if err != nil {
		return fmt.Errorf("marshal record header: %w", err)
	}

	if _, err := w.Write(rhb); err != nil {
		return fmt.Errorf("write record header: %w", err)
	}

	switch r.Type() {
	case record.TypeValue:
		if err := writeValue(w, r); err != nil {
			return fmt.Errorf("write value: %w", err)
		}
	case record.TypeLink:
		if err := writeLink(w, r); err != nil {
			return fmt.Errorf("write link: %w", err)
		}
	case record.TypeEntity:
	// Entity records do not have additional data to write
	case record.TypeTombstone:
		// Tombstone records do not have additional data to write
	default:
		return fmt.Errorf("unsupported record type: %v", r.Type())
	}

	return nil
}

func writeValue(w io.Writer, r record.Record) error {
	v, ok := r.Value()
	if !ok {
		return fmt.Errorf("record is not a value record")
	}

	data := v.Data()
	size := len(data)
	if size > math.MaxInt32 {
		return fmt.Errorf("value size %d exceeds maximum allowed size of %d bytes", size, math.MaxInt32)
	}

	var sb [4]byte
	binary.BigEndian.PutUint32(sb[:], uint32(size))
	if _, err := w.Write(sb[:]); err != nil {
		return fmt.Errorf("write value size: %w", err)
	}

	if _, err := w.Write(data); err != nil {
		return fmt.Errorf("write value: %w", err)
	}

	return nil
}

func writeLink(w io.Writer, r record.Record) error {
	l, ok := r.Link()
	if !ok {
		return fmt.Errorf("record is not a link record")
	}

	ab, err := l.A().MarshalBinary()
	if err != nil {
		return fmt.Errorf("marshal link: %w", err)
	}
	if _, err := w.Write(ab); err != nil {
		return fmt.Errorf("write link: %w", err)
	}

	bb, err := l.B().MarshalBinary()
	if err != nil {
		return fmt.Errorf("marshal link: %w", err)
	}
	if _, err := w.Write(bb); err != nil {
		return fmt.Errorf("write link: %w", err)
	}

	return nil
}
