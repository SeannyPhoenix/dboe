package server

import (
	"encoding/json"
	"net/http"

	"github.com/seannyphoenix/dboe/internal/config"
)

func newDumpDBHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		b, err := json.Marshal(cfg.DB)
		if err != nil {
			http.Error(w, "Failed to marshal database", http.StatusInternalServerError)
			return
		}
		_, err = w.Write(b)
		if err != nil {
			http.Error(w, "Failed to write response", http.StatusInternalServerError)
			return
		}
	}
}
