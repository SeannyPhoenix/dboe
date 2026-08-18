package server

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/seannyphoenix/dboe/internal/config"
	"github.com/seannyphoenix/dboe/pkg/record"
)

func newAddRecordHandler(cfg *config.Config) (http.HandlerFunc, error) {
	return func(w http.ResponseWriter, r *http.Request) {
		b, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to read request body", http.StatusInternalServerError)
			return
		}

		var recs []record.Record
		err = json.Unmarshal(b, &recs)
		if err != nil {
			http.Error(w, "Invalid record list", http.StatusBadRequest)
			return
		}

		for _, rec := range recs {
			if !rec.IsValid() {
				http.Error(w, fmt.Sprintf("Invalid record %s", rec.ID()), http.StatusBadRequest)
				return
			}
		}

		for _, rec := range recs {
			err = cfg.AddRecord(rec)
			if err != nil {
				http.Error(w, "Failed to add record", http.StatusInternalServerError)
				return
			}
		}

		w.WriteHeader(http.StatusCreated)
		_, err = fmt.Fprintf(w, "%d record(s) added successfully", len(recs))
		if err != nil {
			http.Error(w, "Failed to write response", http.StatusInternalServerError)
			return
		}
	}, nil
}
