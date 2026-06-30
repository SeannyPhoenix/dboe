package binary

import (
	"bytes"
	"fmt"
)

var prefix = []byte("dboe")

const (
	prefixSize     = 4  // "dboe" is 4 bytes
	uuidSize       = 16 // UUID is 16 bytes
	fileHeaderSize = prefixSize + uuidSize
)

type fileHeader struct {
	version version
}

// MarshalBinary implements encoding.BinaryMarshaler
func (fh *fileHeader) MarshalBinary() ([]byte, error) {
	return append(prefix, fh.version.uuid[:]...), nil
}

// UnmarshalBinary implements encoding.BinaryUnmarshaler
func (fh *fileHeader) UnmarshalBinary(data []byte) error {
	if len(data) != fileHeaderSize {
		return &InvalidHeaderLengthError{len: len(data)}
	}

	p := data[:prefixSize]
	if !bytes.Equal(p, prefix) {
		return &InvalidHeaderPrefixError{got: p}
	}

	v, err := parseVersion(data[prefixSize:fileHeaderSize])
	if err != nil {
		return fmt.Errorf("parse version: %w", err)
	}
	fh.version = v

	return nil
}
