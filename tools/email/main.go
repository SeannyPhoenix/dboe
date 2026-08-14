package main

import (
	"bytes"
	_ "embed"
	"fmt"
	"io"
	"log"

	"github.com/seannyphoenix/dboe/pkg/core/email"
)

//go:embed email.eml
var input []byte

func main() {
	err := run()
	if err != nil {
		log.Fatal(err)
	}
}

func run() error {
	msg, err := email.Parse(bytes.NewBuffer(input))
	if err != nil {
		return err
	}

	for k := range msg.Header {
		fmt.Printf("%s: %s\n", k, msg.Header.Get(k))
	}

	body, err := io.ReadAll(msg.Body)
	if err != nil {
		return fmt.Errorf("read body: %w", err)
	}
	fmt.Println(string(body))

	return nil
}
