package interfaces

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	app "github.com/shojib116/chat-app-server/application"
	"github.com/shojib116/chat-app-server/config"
	"github.com/shojib116/chat-app-server/interfaces/middlewares"
	"github.com/shojib116/chat-app-server/interfaces/utils"
	"github.com/shojib116/chat-app-server/internal/auth"
)

type Handler struct {
	services *app.Services
	cfg      *config.Config
}

func NewHandler(services *app.Services, cfg *config.Config) *Handler {
	return &Handler{
		services: services,
		cfg:      cfg,
	}
}

func (h *Handler) handleWS(allowedOrigin string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, ok := middlewares.GetSessionFromContext(r.Context())
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
			utils.HandleAndLogError(w, r, http.StatusInternalServerError, "connection upgrade failed")
			return
		}

		h.services.WebSocket(conn, user)
	}
}

func (h *Handler) handleSignin(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	accessToken, refreshToken, err := h.services.SignInUser(req.Username, req.Password)

	if err != nil {
		handleError(w, r, err)
		return
	}

	h.setCookie(w, CookieOptions{
		Name:   string(auth.AccessTokenCookie),
		Value:  accessToken,
		Path:   "/",
		Expiry: h.cfg.AccessTokenExpiry,
	})

	h.setCookie(w, CookieOptions{
		Name:   string(auth.RefreshTokenCookie),
		Value:  refreshToken,
		Path:   "/",
		Expiry: h.cfg.RefreshTokenExpiry,
	})

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) handleSignout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie(string(auth.RefreshTokenCookie))
	if err != nil {
		utils.HandleAndLogError(w, r, http.StatusUnauthorized, "unauthorized")
		return
	}

	err = h.services.SignOutUser(cookie.Value)
	if err != nil {
		handleError(w, r, err)
		return
	}

	h.clearCookie(w, string(auth.AccessTokenCookie), "/")
	h.clearCookie(w, string(auth.RefreshTokenCookie), "/auth/")
}

func (h *Handler) handleAuthRefresh(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie(string(auth.RefreshTokenCookie))
	if err != nil {
		utils.HandleAndLogError(w, r, http.StatusUnauthorized, err.Error()+"unauthorized")
		return
	}

	accessToken, err := h.services.RefreshUser(cookie.Value)

	if err != nil {
		handleError(w, r, err)
		return
	}

	h.setCookie(w, CookieOptions{
		Name:   string(auth.AccessTokenCookie),
		Value:  accessToken,
		Path:   "/",
		Expiry: h.cfg.AccessTokenExpiry,
	})

	w.WriteHeader(http.StatusOK)

}

func (h *Handler) handleMe(w http.ResponseWriter, r *http.Request) {
	user, ok := middlewares.GetSessionFromContext(r.Context())
	if !ok {
		utils.HandleAndLogError(w, r, http.StatusUnauthorized, "unauthorized")
		return
	}

	utils.SendJSON(w, http.StatusOK, user)
}

func (h *Handler) handleGetUsersExceptCurrent(w http.ResponseWriter, r *http.Request) {
	user, ok := middlewares.GetSessionFromContext(r.Context())
	if !ok {
		utils.HandleAndLogError(w, r, http.StatusUnauthorized, "unauthorized")
		return
	}

	users, err := h.services.GetFriendList(user.UserID)
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
	user, ok := middlewares.GetSessionFromContext(r.Context())
	if !ok {
		utils.HandleAndLogError(w, r, http.StatusUnauthorized, "unauthorized")
		return
	}

	conversations, err := h.services.GetChatList(user.UserID)
	if err != nil {
		handleError(w, r, err)
		return
	}

	json.NewEncoder(w).Encode(conversations)
}

func (h *Handler) handleAddFriend(w http.ResponseWriter, r *http.Request) {
	user, ok := middlewares.GetSessionFromContext(r.Context())
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

	conversation, err := h.services.GetOrCreateConversation(user.UserID, req.UserID)
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
	case *app.ErrUnauthenticated:
		utils.HandleAndLogError(w, r, http.StatusUnauthorized, "user not authorized")
	}
}

type CookieOptions struct {
	Name   string
	Value  string
	Path   string
	Expiry time.Duration
}

func (h *Handler) setCookie(w http.ResponseWriter, opts CookieOptions) {
	http.SetCookie(w, &http.Cookie{
		Name:     opts.Name,
		Value:    opts.Value,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
		Path:     opts.Path,
		Expires:  time.Now().Add(opts.Expiry),
	})
}

func (h *Handler) clearCookie(w http.ResponseWriter, name, path string) {
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    "",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
		Path:     path,
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
	})
}
