package prnt

import (
	"errors"
	"fmt"
	"io"
	"os"
)

const (
	defaultBinaryFile = "db.dboe"
	defaultJSONFile   = "db.jsonl"
)

type context struct {
	inFile string
	reader io.ReadCloser

	outFile string
	writer  io.WriteCloser

	args []string
}

func (c context) nextArg() string {
	if len(c.args) >= 1 {
		return c.args[0]
	}
	return ""
}

func (c context) popArg() context {
	if len(c.args) >= 1 {
		c.args = c.args[1:]
	}
	return c
}

func (c *context) open() (func() error, error) {
	if c.reader == nil {
		if c.inFile == "" {
			c.inFile = defaultBinaryFile
		}
		f, err := os.Open(c.inFile)
		if err != nil {
			return nil, fmt.Errorf("open input file: %w", err)
		}
		c.reader = f
	}

	if c.writer == nil {
		if c.outFile == "" {
			c.writer = os.Stdout
		} else {
			f, err := os.Create(c.outFile)
			if err != nil {
				return nil, fmt.Errorf("create output file: %w", err)
			}
			c.writer = f
		}
	}

	close := func() error {
		var err error
		if c.writer != os.Stdout && c.writer != nil {
			err = c.writer.Close()
		}
		if c.reader != nil {
			err = errors.Join(err, c.reader.Close())
		}
		return err
	}

	return close, nil
}

func newContext(args []string) (context, error) {
	pctx := context{
		inFile: defaultBinaryFile,
		args:   args,
	}

	for arg := pctx.nextArg(); arg != ""; arg = pctx.nextArg() {
		pctx = pctx.popArg()

		switch arg {
		case "--out":
			var err error
			pctx, err = out(pctx)
			if err != nil {
				return pctx, fmt.Errorf("set output file: %w", err)
			}
		case "--in":
			var err error
			pctx, err = in(pctx)
			if err != nil {
				return pctx, fmt.Errorf("set input file: %w", err)
			}
		default:
			return pctx, fmt.Errorf("unknown print argument: %s", arg)
		}
	}

	return pctx, nil
}
