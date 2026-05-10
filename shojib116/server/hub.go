package main

import (
	"encoding/json"
	"log"
	"time"
)

type Message struct {
	Text   string    `json:"text"`
	SentAt time.Time `json:"sentAt"`
}

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
	messages   []Message
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
		messages:   []Message{},
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
			msg, err := json.Marshal(h.messages)
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
			msg := Message{
				Text:   string(message),
				SentAt: time.Now(),
			}
			marshalledMsg, err := json.Marshal([]Message{msg})
			if err != nil {
				log.Printf("Broadcasting error: %v", err)
				continue
			}
			h.messages = append(h.messages, msg)

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
