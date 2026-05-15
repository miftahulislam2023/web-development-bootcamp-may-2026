package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/lib/pq"
	app "github.com/shojib116/chat-app-server/application"
	"github.com/shojib116/chat-app-server/config"
	"github.com/shojib116/chat-app-server/infra"
	"github.com/shojib116/chat-app-server/interfaces"
	"github.com/shojib116/chat-app-server/interfaces/middlewares"
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

	hub := app.NewHub(db, cfg)
	go hub.Run()

	mux := http.NewServeMux()
	mngr := middlewares.NewManager(middlewares.CORS(cfg.FrontendDomain), middlewares.Logger)

	sessionStore := infra.NewSession()
	repo := infra.NewStore(db)

	service := app.NewServices(repo, cfg, sessionStore, hub)

	h := interfaces.NewHandler(service)

	h.RegisterRoutes(mux, mngr, cfg)

	addr := fmt.Sprintf(":%d", cfg.HttpPort)

	log.Println("server listening on port", addr)
	err = http.ListenAndServe(addr, mngr.WrapMux(mux))
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
