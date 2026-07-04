package prnt

func out(pctx context) (context, error) {
	outFile := pctx.nextArg()
	if outFile == "" {
		outFile = defaultJSONFile
	} else {
		pctx = pctx.popArg()
	}

	pctx.outFile = outFile
	return pctx, nil
}
