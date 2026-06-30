package binary

import (
	"fmt"
)

type InvalidHeaderLengthError struct {
	len int
}

func (e *InvalidHeaderLengthError) Error() string {
	return fmt.Sprintf("invalid header length: expected %d, got %d", fileHeaderSize, e.len)
}

type InvalidHeaderPrefixError struct {
	got []byte
}

func (e *InvalidHeaderPrefixError) Error() string {
	return fmt.Sprintf("invalid header prefix: expected %s, got %s", string(prefix), string(e.got))
}

type InvalidHeaderVersionError struct {
	cause error
}

func (e *InvalidHeaderVersionError) Error() string {
	return fmt.Sprintf("invalid header version: %s", e.cause.Error())
}
