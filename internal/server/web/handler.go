package web

import (
	"embed"
	"errors"
	"io/fs"
	"log"
	"net/http"
	"path"
	"strings"

	"github.com/seannyphoenix/dboe/internal/config"
)

//go:generate go run github.com/seannyphoenix/dboe/tools/build
//go:embed assets
var assets embed.FS

func NewStaticWebHandler(cfg *config.Config) (http.HandlerFunc, error) {
	log.Printf("Loading web assets")
	webRoot, err := fs.Sub(assets, "assets")
	if err != nil {
		log.Printf("Failed to load web assets: %v", err)
		return nil, err
	}

	fileServer := http.FileServer(http.FS(webRoot))

	return func(w http.ResponseWriter, r *http.Request) {
		clean := path.Clean("/" + strings.TrimPrefix(r.URL.Path, "/"))
		assetPath := strings.TrimPrefix(clean, "/")
		if assetPath == "" || assetPath == "." {
			assetPath = "index.html"
		}

		if strings.HasPrefix(assetPath, "..") {
			http.NotFound(w, r)
			return
		}

		if _, err := fs.Stat(webRoot, assetPath); err == nil {
			fileServer.ServeHTTP(w, r)
			return
		} else if !errors.Is(err, fs.ErrNotExist) {
			http.Error(w, "Failed to read web asset", http.StatusInternalServerError)
			return
		}

		clone := r.Clone(r.Context())
		clone.URL.Path = "/index.html"
		fileServer.ServeHTTP(w, clone)
	}, nil
}
