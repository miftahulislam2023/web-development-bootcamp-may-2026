package interfaces

import (
	"net/http"

	"github.com/shojib116/chat-app-server/config"
	"github.com/shojib116/chat-app-server/interfaces/middlewares"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, mngr *middlewares.Manager, cfg *config.Config) {
	mux.HandleFunc("/ws", mngr.With(h.handleWS(cfg.FrontendDomain), middlewares.AuthMiddleware(cfg.JWTSecret)))

	mux.HandleFunc("POST /auth/signin", h.handleSignin)
	mux.HandleFunc("POST /auth/signout", h.handleSignout)
	mux.HandleFunc("POST /auth/refresh", h.handleAuthRefresh)

	mux.HandleFunc("GET /me", mngr.With(h.handleMe, middlewares.AuthMiddleware(cfg.JWTSecret)))

	mux.HandleFunc("GET /users", mngr.With(h.handleGetUsersExceptCurrent, middlewares.AuthMiddleware(cfg.JWTSecret)))

	mux.HandleFunc("GET /messages", mngr.With(h.handleGetMessages, middlewares.AuthMiddleware(cfg.JWTSecret)))

	mux.HandleFunc("GET /chatlist", mngr.With(h.handleGetChatList, middlewares.AuthMiddleware(cfg.JWTSecret)))

	mux.HandleFunc("POST /add-friend", mngr.With(h.handleAddFriend, middlewares.AuthMiddleware(cfg.JWTSecret)))

}
