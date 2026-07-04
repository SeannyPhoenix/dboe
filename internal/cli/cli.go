package cli

import (
	"context"
	"fmt"
	"os"

	"github.com/seannyphoenix/dboe/internal/cli/command"
)

func Run(ctx context.Context) error {
	cmd, err := command.Get(os.Args[1:])
	if err != nil {
		return fmt.Errorf("get command: %w", err)
	}

	err = cmd.Run(cmd.Args)
	if err != nil {
		return fmt.Errorf("run command: %w", err)
	}

	return nil
}
