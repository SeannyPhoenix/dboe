package server

import (
	"fmt"
	"net/http"

	"github.com/seannyphoenix/dboe/internal/config"
)

type method string

const (
	MethodHead    method = http.MethodHead
	MethodOptions method = http.MethodOptions
	MethodGet     method = http.MethodGet
	MethodPost    method = http.MethodPost
	MethodQuery   method = "QUERY"
	MethodAll     method = ""
)

type pattern struct {
	method method
	path   string
}

func (p pattern) String() string {
	if p.method == MethodAll {
		return p.path
	}
	return fmt.Sprintf("%s %s", p.method, p.path)
}

type newHandler func(cfg *config.Config) http.HandlerFunc

var uiRoutes = map[pattern]newHandler{
	{MethodGet, "/"}:       newUIIndexHandler,
	{MethodGet, "/app.js"}: newUIAppJSHandler,
}

var apiRoutes = map[pattern]newHandler{
	{MethodGet, "/health"}:             newHealthHandler,
	{MethodGet, "/dump"}:               newDumpDBHandler,
	{MethodGet, "/records/{recordID}"}: newGetRecordHandler,
	{MethodPost, "/records"}:           newAddRecordHandler,
	{MethodAll, "/"}:                   newNotFoundHandler,
}

func registerRoutes(cfg *config.Config) http.Handler {
	api := http.NewServeMux()
	for pattern, newHandler := range apiRoutes {
		api.HandleFunc(pattern.String(), newHandler(cfg))
	}

	ui := http.NewServeMux()
	for pattern, newHandler := range uiRoutes {
		ui.HandleFunc(pattern.String(), newHandler(cfg))
	}

	root := http.NewServeMux()
	root.Handle("/api/", http.StripPrefix("/api", api))
	root.Handle("/", ui)
	return root
}

func newHealthHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, err := w.Write([]byte("DBOE server is running"))
		if err != nil {
			http.Error(w, "Failed to write response", http.StatusInternalServerError)
			return
		}
	}
}

func newNotFoundHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "Not Found", http.StatusNotFound)
	}
}
