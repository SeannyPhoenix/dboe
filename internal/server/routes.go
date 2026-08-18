package server

import (
	"fmt"
	"net/http"

	"github.com/seannyphoenix/dboe/internal/config"
	"github.com/seannyphoenix/dboe/internal/server/web"
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

type newHandler func(cfg *config.Config) (http.HandlerFunc, error)

var webRoutes = map[pattern]newHandler{
	{MethodGet, "/"}: web.NewStaticWebHandler,
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
		handler, err := newHandler(cfg)
		if err != nil {
			panic(fmt.Sprintf("Failed to create handler for %s: %v", pattern.String(), err))
		}
		api.HandleFunc(pattern.String(), handler)
	}

	webServer := http.NewServeMux()
	for pattern, newHandler := range webRoutes {
		handler, err := newHandler(cfg)
		if err != nil {
			panic(fmt.Sprintf("Failed to create handler for %s: %v", pattern.String(), err))
		}
		webServer.HandleFunc(pattern.String(), handler)
	}

	root := http.NewServeMux()
	root.Handle("/api/", http.StripPrefix("/api", api))
	root.Handle("/", webServer)
	return root
}

func newHealthHandler(cfg *config.Config) (http.HandlerFunc, error) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, err := w.Write([]byte("DBOE server is running"))
		if err != nil {
			http.Error(w, "Failed to write response", http.StatusInternalServerError)
			return
		}
	}, nil
}

func newNotFoundHandler(cfg *config.Config) (http.HandlerFunc, error) {
	return func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "Not Found", http.StatusNotFound)
	}, nil
}
