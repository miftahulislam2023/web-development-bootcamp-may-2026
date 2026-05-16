package utils

import (
	"encoding/json"
	"log"
	"net/http"
)

func SendJSON(w http.ResponseWriter, statusCode int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if data != nil {
		if err := json.NewEncoder(w).Encode(data); err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}
	}
}

func SendError(w http.ResponseWriter, statusCode int, message string) {
	SendJSON(w, statusCode, map[string]string{"error": message})
}

func HandleAndLogError(w http.ResponseWriter, r *http.Request, status int, msg string) {
	log.Printf(
		"[ERROR] %s %s | err=%v",
		r.Method,
		r.URL.Path,
		msg,
	)

	SendError(w, status, msg)
}
