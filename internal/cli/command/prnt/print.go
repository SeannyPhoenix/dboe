package prnt

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/seannyphoenix/dboe/pkg/storage/binary"
)

func Run(args []string) (retErr error) {
	pctx, err := newContext(args)
	if err != nil {
		return fmt.Errorf("create print context: %w", err)
	}

	close, err := pctx.open()
	if err != nil {
		return fmt.Errorf("open print files: %w", err)
	}
	defer func() {
		err := close()
		retErr = errors.Join(retErr, err)
	}()

	rr, err := binary.Read(pctx.reader)
	if err != nil {
		return fmt.Errorf("read binary file: %w", err)
	}

	for _, record := range rr {
		j, err := json.Marshal(record)
		if err != nil {
			return fmt.Errorf("marshal record to JSON: %w", err)
		}
		_, err = fmt.Fprintf(pctx.writer, "%s\n", j)
		if err != nil {
			return fmt.Errorf("write JSON to output: %w", err)
		}
	}

	return nil
}
