package command

import (
	"errors"

	"github.com/seannyphoenix/dboe/internal/cli/command/cmdnew"
	"github.com/seannyphoenix/dboe/internal/cli/command/initialize"
	"github.com/seannyphoenix/dboe/internal/cli/command/prnt"
	"github.com/seannyphoenix/dboe/internal/cli/command/usage"
)

type Command struct {
	Name string
	Args []string
	Run  func(args []string) error
}

var (
	commandInitialize = Command{
		Name: "Init",
		Run:  initialize.Run,
	}
	commandNew = Command{
		Name: "New",
		Run:  cmdnew.Run,
	}
	commandPrint = Command{
		Name: "Print",
		Run:  prnt.Run,
	}
	commandUsage = Command{
		Name: "Usage",
		Run:  usage.Run,
	}
)

var commands = map[string]Command{
	"help":  commandUsage,
	"init":  commandInitialize,
	"new":   commandNew,
	"print": commandPrint,
	"usage": commandUsage,
}

func Get(args []string) (Command, error) {
	cmd := commandUsage
	if cmd.Run == nil {
		return cmd, errors.New("invalid default command")
	}

	if len(args) == 0 {
		return cmd, nil
	}

	name := args[0]
	if c, ok := commands[name]; ok {
		cmd = c
	}

	cmd.Args = args[1:]

	return cmd, nil
}
