package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"

	"github.com/seannyphoenix/dboe/pkg/record"
	"github.com/seannyphoenix/dboe/pkg/storage/binary"
)

func main() {
	err := run()
	if err != nil {
		log.Fatal(err)
	}
}

func run() error {
	a := record.NewEntity()
	v := record.NewValue([]byte("Hello, World!"))
	l := record.NewLink(v.ID(), a.ID())

	rr := []record.Record{a, v, l}

	buf := bytes.NewBuffer(nil)
	err := binary.Write(buf, rr)
	if err != nil {
		return err
	}

	fmt.Println(buf.String())
	fmt.Printf("Binary storage: %d bytes\n", buf.Len())

	rr2, err := binary.Read(buf)
	if err != nil {
		return err
	}

	buf = bytes.NewBuffer(nil)
	for _, r := range rr2 {
		b, err := json.Marshal(r)
		if err != nil {
			return err
		}
		b = append(b, '\n')
		if _, err := buf.Write(b); err != nil {
			return err
		}
	}

	fmt.Println(buf.String())
	fmt.Printf("Binary storage: %d bytes\n", buf.Len())

	return nil
}
