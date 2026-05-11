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

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})

	addr := fmt.Sprintf(":%d", cfg.HttpPort)
	err = http.ListenAndServe(addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
