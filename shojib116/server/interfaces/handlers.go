package interfaces

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	app "github.com/shojib116/chat-app-server/application"
	"github.com/shojib116/chat-app-server/interfaces/middlewares"
	"github.com/shojib116/chat-app-server/interfaces/utils"
)

type Handler struct {
	services *app.Services
}

func NewHandler(services *app.Services) *Handler {
	return &Handler{
		services: services,
	}
}

func (h *Handler) handleWS(allowedOrigin string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session, ok := middlewares.GetSession(r)
		if !ok {
			utils.HandleAndLogError(w, r, http.StatusUnauthorized, "unauthorized")
			return
		}

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
			fmt.Println(err)
			utils.HandleAndLogError(w, r, http.StatusInternalServerError, "connection upgrade failed")
			return
		}

		h.services.WebSocket(conn, &session)
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

	sessionID, err := h.services.SignInUser(req.Username)

	if err != nil {
		handleError(w, r, err)
		return
	}

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

	h.services.SignOutUser(cookie.Value)

	http.SetCookie(w, &http.Cookie{
		Name:   "session",
		Value:  "",
		MaxAge: -1,
	})
}

func (h *Handler) handleMe(w http.ResponseWriter, r *http.Request) {
	session, ok := middlewares.GetSession(r)
	if !ok {
		utils.HandleAndLogError(w, r, http.StatusUnauthorized, "unauthorized")
		return
	}
	utils.SendJSON(w, http.StatusOK, session)
}

func (h *Handler) handleGetUsersExceptCurrent(w http.ResponseWriter, r *http.Request) {
	session, ok := middlewares.GetSession(r)
	if !ok {
		utils.HandleAndLogError(w, r, http.StatusUnauthorized, "unauthorized")
		return
	}

	users, err := h.services.GetFriendList(session.UserID)
	if err != nil {
		handleError(w, r, err)
		return
	}

	utils.SendJSON(w, http.StatusOK, users)
}

func (h *Handler) handleGetMessages(w http.ResponseWriter, r *http.Request) {
	conversationId := r.URL.Query().Get("conversation_id")

	messages, err := h.services.GetMessages(conversationId)
	if err != nil {
		handleError(w, r, err)
		return
	}

	utils.SendJSON(w, http.StatusOK, messages)
}

func (h *Handler) handleGetChatList(w http.ResponseWriter, r *http.Request) {
	session, ok := middlewares.GetSession(r)
	if !ok {
		utils.HandleAndLogError(w, r, http.StatusUnauthorized, "unauthorized")
		return
	}
	conversations, err := h.services.GetChatList(session.UserID)
	if err != nil {
		handleError(w, r, err)
		return
	}

	json.NewEncoder(w).Encode(conversations)
}

func (h *Handler) handleAddFriend(w http.ResponseWriter, r *http.Request) {
	session, ok := middlewares.GetSession(r)
	if !ok {
		utils.HandleAndLogError(w, r, http.StatusUnauthorized, "unauthorized")
		return
	}
	var req struct {
		UserID uuid.UUID `json:"userId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	conversation, err := h.services.GetOrCreateConversation(session.UserID, req.UserID)
	if err != nil {
		handleError(w, r, err)
		return
	}

	utils.SendJSON(w, http.StatusOK, conversation)
}

func handleError(w http.ResponseWriter, r *http.Request, err error) {
	switch e := err.(type) {
	case *app.ErrBadRequest:
		utils.HandleAndLogError(w, r, http.StatusBadRequest, e.Message)
	case *app.ErrInternalServer:
		utils.HandleAndLogError(w, r, http.StatusInternalServerError, "something went wrong")
	}
}
