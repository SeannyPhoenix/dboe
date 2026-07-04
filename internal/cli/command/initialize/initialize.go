package initialize

import (
	"fmt"
	"os"

	"github.com/seannyphoenix/dboe/pkg/record"
	"github.com/seannyphoenix/dboe/pkg/storage/binary"
)

func Run(args []string) error {
	outFile := "db.dboe"
	if len(args) > 0 {
		outFile = args[0]
	}

	s, err := os.Stat(outFile)
	if err == nil && s.Size() > 0 {
		return fmt.Errorf("output file already exists and is not empty: %s", outFile)
	}

	out, err := os.Create(outFile)
	if err != nil {
		return fmt.Errorf("create output file: %w", err)
	}
	defer out.Close()

	err = binary.Write(out, initRecords())
	if err != nil {
		return fmt.Errorf("write initial records: %w", err)
	}

	return nil
}

func initRecords() []record.Record {
	initRecord := record.NewEntity()

	return []record.Record{
		initRecord,
	}
}
