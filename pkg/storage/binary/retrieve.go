package binary

import (
	"fmt"
	"io"

	"github.com/seannyphoenix/dboe/pkg/record"
)

// Retrieve a record from any point in the binary storage file.
func Retrieve(rs io.ReadSeeker, offset int64) (record.Record, error) {
	var r record.Record

	_, err := rs.Seek(offset, io.SeekStart)
	if err != nil {
		return r, InvalidOffsetError{offset: offset}
	}

	r, err = readRecord(rs)
	if err != nil {
		return r, fmt.Errorf("read record: %w", err)
	}

	return r, nil
}
