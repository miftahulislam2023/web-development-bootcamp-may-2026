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
	mux.HandleFunc("GET /users", h.requireAuth(h.handleGetUsersExceptCurrent))

	mux.HandleFunc("GET /messages", h.requireAuth(h.handleGetMessages))

	mux.HandleFunc("GET /chatlist", h.requireAuth(h.handleGetChatList))

	mux.HandleFunc("POST /add-friend", h.requireAuth(h.handleAddFriend))

	addr := fmt.Sprintf(":%d", cfg.HttpPort)
	err = http.ListenAndServe(addr, h.handleCORS(mux))
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
