package server

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/internal/config"
)

func newGetRecordHandler(cfg *config.Config) (http.HandlerFunc, error) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		recordID, err := uuid.Parse(r.PathValue("recordID"))
		if err != nil {
			http.Error(w, "Invalid record ID", http.StatusBadRequest)
			return
		}

		record, ok := cfg.DB.GetRecordByID(recordID)
		if !ok {
			http.Error(w, "Record not found", http.StatusNotFound)
			return
		}

		b, err := json.Marshal(record)
		if err != nil {
			http.Error(w, "Failed to marshal record", http.StatusInternalServerError)
			return
		}

		_, err = w.Write(b)
		if err != nil {
			http.Error(w, "Failed to write response", http.StatusInternalServerError)
			return
		}
	}, nil
}
