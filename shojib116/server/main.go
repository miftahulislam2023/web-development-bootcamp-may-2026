package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/lib/pq"
	"github.com/shojib116/chat-app-server/config"
	"github.com/shojib116/chat-app-server/internal/database"
)

func main() {
	cfg := config.GetConfig()
	sessionStore := NewSession()

	dbURL := database.GetConnectionString(cfg.DB)

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Println(err)
		return
	}

	if err := db.Ping(); err != nil {
		log.Println(err)
	}

	hub := newHub(db, cfg)
	go hub.run()

	mux := http.NewServeMux()

	h := NewHandler(db, cfg, sessionStore)
	mux.HandleFunc("/ws", h.requireAuth(h.handleWS(hub)))

	mux.HandleFunc("POST /signin", h.handleSignin)
	mux.HandleFunc("POST /signout", h.handleSignout)
	mux.HandleFunc("GET /me", h.requireAuth(h.handleMe))

	addr := fmt.Sprintf(":%d", cfg.HttpPort)
	err = http.ListenAndServe(addr, h.handleCORS(mux))
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
