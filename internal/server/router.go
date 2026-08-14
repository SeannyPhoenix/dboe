package server

import (
	"fmt"
	"net/http"

	"github.com/seannyphoenix/dboe/internal/config"
)

type pattern struct {
	method string
	path   string
}

func (p pattern) String() string {
	return fmt.Sprintf("%s %s", p.method, p.path)
}

type handleWrapper func(cfg *config.Config) http.HandlerFunc

var router = map[pattern]handleWrapper{
	{method: MethodGet, path: "/health"}:            healthHandler,
	{method: MethodGet, path: "/dump"}:              dumpDBHandler,
	{method: MethodGet, path: "/record/{recordID}"}: getRecordHandler,
	{method: MethodPost, path: "/record"}:           addRecordHandler,
}

func registerRouter(cfg *config.Config) {
	for pattern, wrapHandler := range router {
		http.HandleFunc(pattern.String(), wrapHandler(cfg))
	}
}

func healthHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, err := w.Write([]byte("DBOE server is running"))
		if err != nil {
			http.Error(w, "Failed to write response", http.StatusInternalServerError)
			return
		}
	}
}
