package binary

import (
	"encoding/binary"
	"errors"
	"fmt"
	"io"

	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/pkg/record"
)

func Read(r io.Reader) ([]record.Record, error) {
	if r == nil {
		return nil, fmt.Errorf("reader is nil")
	}

	// The file header must exist, but for now there
	// is only one version, so we throw it away after
	// validating it.
	_, err := readFileHeader(r)
	if err != nil {
		return nil, fmt.Errorf("read header: %w", err)
	}

	var rr []record.Record
	for {
		rec, err := readRecord(r)
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			// If an unexpected error occurs, all successfully read records
			// will be returned along with the error.
			return rr, fmt.Errorf("read record: %w", err)
		}

		rr = append(rr, rec)
	}

	return rr, nil
}

func readFileHeader(r io.Reader) (fileHeader, error) {
	var fh fileHeader
	var fhb [fileHeaderSize]byte
	_, err := io.ReadFull(r, fhb[:])
	if err == io.EOF {
		return fh, io.ErrUnexpectedEOF
	}
	if err != nil {
		return fh, fmt.Errorf("read header: %w", err)
	}

	err = fh.UnmarshalBinary(fhb[:])
	if err == io.EOF {
		return fh, io.ErrUnexpectedEOF
	}
	if err != nil {
		return fh, fmt.Errorf("unmarshal header: %w", err)
	}

	return fh, nil
}

// Read a record from the current position in the reader.
func readRecord(r io.Reader) (record.Record, error) {
	var rec record.Record

	rh, err := readRecordHeader(r)
	if err != nil {
		return rec, fmt.Errorf("read record header: %w", err)
	}

	var v record.Value
	var l record.Link
	switch rh.t {
	case record.TypeValue:
		// Value Records include a Value
		v, err = readValue(r)
	case record.TypeLink:
		// Link Records include a Link
		l, err = readLink(r)
	case record.TypeEntity:
		// Entity Records have no additional data to read
	case record.TypeTombstone:
		// Tombstone Records have no additional data to read
	default:
		return rec, fmt.Errorf("unsupported record type: %d", rh.t)
	}
	if err != nil {
		return rec, fmt.Errorf("read record data: %w", err)
	}

	rec = record.RecordFromComponents(rh.t, rh.id, rh.ts, v, l)
	if !rec.IsValid() {
		return rec, InvalidRecordError{record: rec}
	}

	return rec, nil
}

func readRecordHeader(r io.Reader) (recordHeader, error) {
	var rh recordHeader
	var rhb [recordHeaderSize]byte
	_, err := io.ReadFull(r, rhb[:])
	if err == io.EOF {
		return rh, err
	}
	if err != nil {
		return rh, fmt.Errorf("read record header: %w", err)
	}

	if err := rh.UnmarshalBinary(rhb[:]); err != nil {
		return rh, fmt.Errorf("unmarshal record header: %w", err)
	}
	return rh, nil
}

func readValue(r io.Reader) (record.Value, error) {
	var v record.Value
	sb := make([]byte, 4)
	if _, err := io.ReadFull(r, sb); err != nil {
		return v, fmt.Errorf("read value size: %w", err)
	}
	size := binary.BigEndian.Uint32(sb)

	data := make([]byte, size)
	if _, err := io.ReadFull(r, data); err != nil {
		return v, fmt.Errorf("read value: %w", err)
	}

	v = record.ValueFromBytes(data)
	return v, nil
}

func readLink(r io.Reader) (record.Link, error) {
	var l record.Link
	lb := make([]byte, 32)
	if _, err := io.ReadFull(r, lb[:]); err != nil {
		return l, fmt.Errorf("read link: %w", err)
	}

	a, err := uuid.FromBytes(lb[:16])
	if err != nil {
		return l, &InvalidLinkError{side: "a", cause: err}
	}

	b, err := uuid.FromBytes(lb[16:])
	if err != nil {
		return l, &InvalidLinkError{side: "b", cause: err}
	}

	l = record.LinkFromUUIDs(a, b)
	return l, nil
}
