package main

import (
	"context"
	"log"

	"github.com/seannyphoenix/dboe/internal/cli"
)

func main() {
	ctx := context.Background()
	err := cli.Run(ctx)
	if err != nil {
		log.Fatalf("error: %v", err)
	}
}
