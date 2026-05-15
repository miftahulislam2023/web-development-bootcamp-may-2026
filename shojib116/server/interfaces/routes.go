package interfaces

import (
	"net/http"

	"github.com/shojib116/chat-app-server/config"
	"github.com/shojib116/chat-app-server/interfaces/middlewares"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, mngr *middlewares.Manager, cfg *config.Config) {
	mux.HandleFunc("/ws", mngr.With(h.handleWS(cfg.FrontendDomain), middlewares.RequireAuth(h.services)))

	mux.HandleFunc("POST /signin", h.handleSignin)
	mux.HandleFunc("POST /signout", h.handleSignout)

	mux.HandleFunc("GET /me", mngr.With(h.handleMe, middlewares.RequireAuth(h.services)))
	mux.HandleFunc("GET /users", mngr.With(h.handleGetUsersExceptCurrent, middlewares.RequireAuth(h.services)))

	mux.HandleFunc("GET /messages", mngr.With(h.handleGetMessages, middlewares.RequireAuth(h.services)))

	mux.HandleFunc("GET /chatlist", mngr.With(h.handleGetChatList, middlewares.RequireAuth(h.services)))

	mux.HandleFunc("POST /add-friend", mngr.With(h.handleAddFriend, middlewares.RequireAuth(h.services)))

}
