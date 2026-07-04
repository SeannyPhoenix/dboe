package prnt

import "fmt"

func in(pctx context) (context, error) {
	inFile := pctx.nextArg()
	if inFile == "" {
		return pctx, fmt.Errorf("missing input file argument")
	}

	pctx.inFile = inFile
	pctx = pctx.popArg()

	return pctx, nil
}
