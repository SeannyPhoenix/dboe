package server

import (
	"embed"
	"net/http"

	"github.com/seannyphoenix/dboe/internal/config"
)

//go:embed web/index.html web/app.js
var uiAssets embed.FS

func newUIIndexHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		b, err := uiAssets.ReadFile("web/index.html")
		if err != nil {
			http.Error(w, "Failed to load UI", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		_, err = w.Write(b)
		if err != nil {
			http.Error(w, "Failed to write response", http.StatusInternalServerError)
			return
		}
	}
}

func newUIAppJSHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		b, err := uiAssets.ReadFile("web/app.js")
		if err != nil {
			http.Error(w, "Failed to load UI script", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
		_, err = w.Write(b)
		if err != nil {
			http.Error(w, "Failed to write response", http.StatusInternalServerError)
			return
		}
	}
}
