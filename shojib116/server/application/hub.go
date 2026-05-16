package application

import (
	"encoding/json"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/shojib116/chat-app-server/config"
	"github.com/shojib116/chat-app-server/infra"
	"github.com/shojib116/chat-app-server/internal/database"
)

type Envelope struct {
	Type           string    `json:"type"`
	ConversationID uuid.UUID `json:"conversation_id"`
	From           uuid.UUID `json:"from"`
	To             uuid.UUID `json:"to"`
	Text           string    `json:"text"`
	SentAt         time.Time `json:"sentAt"`
}

type Hub struct {
	clients    map[*Client]bool
	users      map[string]*Client
	broadcast  chan Envelope
	register   chan *Client
	unregister chan *Client
	cfg        *config.Config
	repo       *infra.Store
}

func NewHub(cfg *config.Config, repo *infra.Store) *Hub {
	return &Hub{
		broadcast:  make(chan Envelope),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
		users:      make(map[string]*Client),
		cfg:        cfg,
		repo:       repo,
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
			h.users[client.user.UserID.String()] = client

		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.users, client.user.UserID.String())
				delete(h.clients, client)
				close(client.send)
			}

		case env := <-h.broadcast:
			if env.Type == "direct" {
				msg, err := h.repo.CreateMessage(env.Text, env.From, env.ConversationID, env.SentAt)
				if err != nil {
					log.Printf("Failed to save message, %v", err)
					continue
				}

				data, err := json.Marshal([]database.Message{msg})
				if err != nil {
					log.Printf("Broadcasting error: %v", err)
					continue
				}
				if recipient, ok := h.users[env.To.String()]; ok {
					recipient.send <- data
				}
				if sender, ok := h.users[env.From.String()]; ok {
					sender.send <- data
				}
			}
		}
	}
}
