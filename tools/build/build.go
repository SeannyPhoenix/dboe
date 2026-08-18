package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/evanw/esbuild/pkg/api"
)

func build() int {
	root, ok := os.LookupEnv("DBOE_BUILD_ROOT")
	if !ok {
		fmt.Fprintln(os.Stderr, "DBOE_BUILD_ROOT environment variable is not set")
		return 1
	}

	opts := api.BuildOptions{
		EntryPoints: []string{
			filepath.Join(root, "src/web/app.tsx"),
			filepath.Join(root, "src/web/index.html"),
		},
		Outdir: filepath.Join(root, "internal/server/web/assets"),
		Loader: map[string]api.Loader{
			".html": api.LoaderCopy,
		},
		Bundle:    true,
		Write:     true,
		Target:    api.ESNext,
		Format:    api.FormatESModule,
		Sourcemap: api.SourceMapExternal,
		Platform:  api.PlatformBrowser,
	}
	res := api.Build(opts)
	if len(res.Errors) > 0 {
		for _, err := range res.Errors {
			fmt.Fprintf(os.Stderr, "Build error: %s\n", err.Text)
		}
		return 1
	}
	return 0
}
