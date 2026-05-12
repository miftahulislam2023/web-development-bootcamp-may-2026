package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/shojib116/chat-app-server/config"
	"github.com/shojib116/chat-app-server/internal/database"
)

type Handler struct {
	db           *sql.DB
	q            *database.Queries
	cfg          *config.Config
	sessionStore *SessionStore
}

func NewHandler(db *sql.DB, cfg *config.Config, ss *SessionStore) *Handler {
	return &Handler{
		db:           db,
		q:            database.New(db),
		cfg:          cfg,
		sessionStore: ss,
	}
}

func (h *Handler) handleWS(hub *Hub) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		allowedOrigin := hub.cfg.FrontendDomain
		var upgrader = websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				origin := r.Header.Get("Origin")
				return origin == allowedOrigin
			},
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256)}
		client.hub.register <- client

		go client.writePump()
		go client.readPump()
	}
}

func (h *Handler) handleSignin(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Username string `json:"username"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	if len(req.Username) < 1 {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	user, err := h.q.GetUserByUsername(r.Context(), req.Username)
	if err != sql.ErrNoRows && err != nil {
		log.Println(err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	if err == sql.ErrNoRows {
		user, err = h.q.CreateUser(r.Context(), req.Username)
		if err != nil {
			log.Println(err)
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}
	}

	sessionID := h.sessionStore.Create(Session{
		UserID:   user.ID,
		Username: user.Username,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "session",
		Value:    sessionID,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		Path:     "/",
	})

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) handleSignout(w http.ResponseWriter, r *http.Request) {
	cookie, _ := r.Cookie("session")
	h.sessionStore.Delete(cookie.Value)

	http.SetCookie(w, &http.Cookie{
		Name:   "session",
		Value:  "",
		MaxAge: -1,
	})
}

func (h *Handler) handleMe(w http.ResponseWriter, r *http.Request) {
	session := r.Context().Value("user").(Session)
	json.NewEncoder(w).Encode(session)
}

func (h *Handler) handleGetUsersExceptCurrent(w http.ResponseWriter, r *http.Request) {
	session := r.Context().Value("user").(Session)

	users, err := h.q.GetAllUsersExceptCurrent(r.Context(), session.UserID)
	if err != nil {
		http.Error(w, "failed to fetch users", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(users)
}

func (h *Handler) handleGetChatList(w http.ResponseWriter, r *http.Request) {
	session := r.Context().Value("user").(Session)

	conversations, err := h.q.GetConversationsForUser(r.Context(), session.UserID)
	if err != nil {
		http.Error(w, "failed to fetch conversations", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(conversations)
}

func (h *Handler) handleAddFriend(w http.ResponseWriter, r *http.Request) {
	session := r.Context().Value("user").(Session)

	var req struct {
		UserID uuid.UUID `json:"userId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	user_a_id, user_b_id := req.UserID, session.UserID
	if strings.Compare(user_a_id.String(), user_b_id.String()) < 0 {
		user_a_id, user_b_id = user_b_id, user_a_id
	}

	conversation, err := h.q.GetConversationByBothUserId(r.Context(), database.GetConversationByBothUserIdParams{
		UserAID: user_a_id,
		UserBID: user_b_id,
	})
	if err != sql.ErrNoRows && err != nil {
		log.Println(err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	if err == sql.ErrNoRows {
		conversation, err = h.q.CreateConversation(r.Context(), database.CreateConversationParams{
			UserAID: user_a_id,
			UserBID: user_b_id,
		})
		if err != nil {
			log.Println(err)
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}
	}

	json.NewEncoder(w).Encode(conversation)
}

func (h *Handler) requireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("session")
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		session, ok := h.sessionStore.Get(cookie.Value)
		if !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		ctx := context.WithValue(r.Context(), "user", session)
		next(w, r.WithContext(ctx))
	}
}

func (h *Handler) handleCORS(next *http.ServeMux) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", h.cfg.FrontendDomain)
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	}
}
