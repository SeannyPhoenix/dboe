package binary

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/seannyphoenix/binarytime/pkg/binarytime"
	"github.com/seannyphoenix/dboe/pkg/record"
)

const (
	recordHeaderSize = 33
)

var (
	ErrorInvalidHeader = errors.New("invalid header")
)

type recordHeader struct {
	t  record.Type
	id uuid.UUID
	ts binarytime.Date
}

// UnmarshalBinary implements encoding.BinaryUnmarshaler
func (rh *recordHeader) UnmarshalBinary(data []byte) error {
	if len(data) != recordHeaderSize {
		return ErrorInvalidHeader
	}
	rh.t = record.Type(data[0])

	id, err := uuid.FromBytes(data[1:17])
	if err != nil {
		return fmt.Errorf("parse record id: %w", err)
	}
	rh.id = id

	var t binarytime.Date
	err = t.UnmarshalBinary(data[17:33])
	if err != nil {
		return fmt.Errorf("parse record timestamp: %w", err)
	}
	rh.ts = t

	return nil
}

// MarshalBinary implements encoding.BinaryMarshaler
func (rh *recordHeader) MarshalBinary() ([]byte, error) {
	b := [recordHeaderSize]byte{}
	b[0] = byte(rh.t)
	copy(b[1:17], rh.id[:])
	tsBytes, err := rh.ts.MarshalBinary()
	if err != nil {
		return nil, fmt.Errorf("marshal record timestamp: %w", err)
	}
	copy(b[17:33], tsBytes)

	return b[:], nil
}
