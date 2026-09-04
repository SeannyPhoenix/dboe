package main

import (
	"fmt"
	"log"
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

	opt := api.BuildOptions{
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

	if len(os.Args) > 1 && os.Args[1] == "--watch" {
		log.Println("building in watch mode")
		ctx, err := api.Context(opt)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to create build context: %s\n", err)
			return 1
		}
		watchErr := ctx.Watch(api.WatchOptions{})
		if watchErr != nil {
			fmt.Fprintf(os.Stderr, "Build error: %s\n", watchErr)
			return 1
		}

		<-make(chan struct{})
		return 0
	}

	log.Println("building")
	res := api.Build(opt)
	if len(res.Errors) > 0 {
		for _, err := range res.Errors {
			fmt.Fprintf(os.Stderr, "Build error: %s\n", err.Text)
		}
		return 1
	}
	return 0
}
