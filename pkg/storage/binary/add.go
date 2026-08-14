package binary

import (
	"fmt"
	"io"

	"github.com/seannyphoenix/dboe/pkg/record"
)

func Add(w io.Writer, rec record.Record) error {
	if w == nil {
		return fmt.Errorf("writer is nil")
	}

	return writeRecord(w, rec)
}
