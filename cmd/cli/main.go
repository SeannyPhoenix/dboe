package main

import (
	"encoding/json"
	"os"

	"github.com/seannyphoenix/dboe/pkg/core"
	"github.com/seannyphoenix/dboe/pkg/duration"
	"github.com/seannyphoenix/dboe/pkg/person"
)

func main() {
	// create/truncate file for writing
	f, err := os.Create("schemas.jsonl")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	for _, def := range getDefinitions() {
		b, err := json.Marshal(def)
		if err != nil {
			panic(err)
		}
		_, err = f.WriteString(string(b) + "\n")
		if err != nil {
			panic(err)
		}

	}
}

func getDefinitions() []any {
	return []any{
		core.Boolean,
		core.String,
		core.Integer,
		core.Fixed128,
		core.BinaryTime,

		duration.Nanosecond,
		duration.Microsecond,
		duration.Millisecond,
		duration.Second,
		duration.Minute,
		duration.Day,
		duration.Week,
		duration.Fortnight,
		duration.Month,
		duration.Year,

		person.Person,
		person.Name,
		person.BirthDateTime,
		person.DeathDateTime,
		person.Age,
	}
}
