package usage

import (
	"fmt"
)

func Run([]string) error {
	usage := usage()
	fmt.Println(usage)
	return nil
}

func usage() string {
	return `Usage: dboe <command> [options]

commands:
  print - Prints the entire database as JSONL
    --out [<file>]  Save into the specified file.
		                If a file name is not provided,
									  defaults to db.dboe`
}
