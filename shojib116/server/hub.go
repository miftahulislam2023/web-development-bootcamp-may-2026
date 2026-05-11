package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"time"

	"github.com/shojib116/chat-app-server/config"
	"github.com/shojib116/chat-app-server/internal/database"
)

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
	db         *sql.DB
	queries    *database.Queries
	cfg        *config.Config
}

func newHub(db *sql.DB, cfg *config.Config) *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
		db:         db,
		queries:    database.New(db),
		cfg:        cfg,
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
			messages, err := h.queries.GetAllMessages(context.Background())
			if err != nil {
				log.Printf("Broadcasting error on new client: %v", err)
				continue
			}

			msg, err := json.Marshal(messages)
			if err != nil {
				log.Printf("Broadcasting error on new client: %v", err)
				continue
			}
			client.send <- msg
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:

			msg, err := h.queries.CreateMessage(context.Background(), database.CreateMessageParams{
				Text:   string(message),
				SentAt: time.Now(),
			})
			if err != nil {
				log.Printf("Failed to save message: %v", err)
				continue
			}
			marshalledMsg, err := json.Marshal([]database.Message{msg})
			if err != nil {
				log.Printf("Broadcasting error: %v", err)
				continue
			}
			for client := range h.clients {
				select {
				case client.send <- marshalledMsg:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}
