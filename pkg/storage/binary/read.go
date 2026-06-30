package binary

import (
	"encoding/binary"
	"fmt"
	"io"

	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/pkg/record"
)

func Read(r io.Reader) ([]record.Record, error) {
	// The file header must exist, but for now there
	// is only one version, so we throw it away after
	// validating it.
	_, err := readFileHeader(r)
	if err != nil {
		return nil, fmt.Errorf("read header: %w", err)
	}

	rr, err := readRecords(r)
	if err != nil {
		return nil, fmt.Errorf("read records: %w", err)
	}

	return rr, nil
}

func readFileHeader(r io.Reader) (fileHeader, error) {
	var fh fileHeader
	var fhb [fileHeaderSize]byte
	if _, err := io.ReadFull(r, fhb[:]); err != nil {
		return fh, fmt.Errorf("read header: %w", err)
	}

	// fileHeader.UnmarshalBinary returns an error
	// if the header is invalid.
	if err := fh.UnmarshalBinary(fhb[:]); err != nil {
		return fh, fmt.Errorf("unmarshal header: %w", err)
	}
	return fh, nil
}

// If an unexpected error occurs, all successfully read records
// will be returned along with the error.
func readRecords(r io.Reader) ([]record.Record, error) {
	var rr []record.Record
	for {
		rh, err := readRecordHeader(r)
		if err == io.EOF {
			break
		}
		if err != nil {
			return rr, fmt.Errorf("read record header: %w", err)
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
			return rr, fmt.Errorf("unsupported record type: %d", rh.t)
		}
		if err != nil {
			return rr, fmt.Errorf("read record data: %w", err)
		}

		r := record.RecordFromComponents(rh.t, rh.id, rh.ts, v, l)
		if !r.IsValid() {
			return rr, fmt.Errorf("invalid record: %+v", r)
		}

		rr = append(rr, r)
	}

	return rr, nil
}

func readRecordHeader(r io.Reader) (recordHeader, error) {
	var rh recordHeader
	var rhb [recordHeaderSize]byte
	_, err := io.ReadFull(r, rhb[:])
	if err == io.EOF {
		return rh, io.EOF
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
		return l, fmt.Errorf("parse uuid a: %w", err)
	}

	b, err := uuid.FromBytes(lb[16:])
	if err != nil {
		return l, fmt.Errorf("parse uuid b: %w", err)
	}

	l = record.LinkFromUUIDs(a, b)
	return l, nil
}
