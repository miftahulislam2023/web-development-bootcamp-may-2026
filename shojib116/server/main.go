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

	repo := infra.NewStore(db)

	hub := app.NewHub(cfg, repo)
	go hub.Run()

	mux := http.NewServeMux()
	mngr := middlewares.NewManager(middlewares.CORS(cfg.FrontendDomain), middlewares.Logger)

	service := app.NewServices(repo, cfg, hub)

	h := interfaces.NewHandler(service, cfg)

	h.RegisterRoutes(mux, mngr, cfg)

	addr := fmt.Sprintf(":%d", cfg.HttpPort)

	log.Println("server listening on port", addr)
	err = http.ListenAndServe(addr, mngr.WrapMux(mux))
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
