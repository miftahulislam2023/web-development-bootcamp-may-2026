package middlewares

import (
	"context"
	"net/http"

	app "github.com/shojib116/chat-app-server/application"
	"github.com/shojib116/chat-app-server/infra"
	"github.com/shojib116/chat-app-server/interfaces/utils"
)

type contextKey string

const UserContextKey contextKey = "user"

func RequireAuth(
	services *app.Services,
) func(http.HandlerFunc) http.HandlerFunc {

	return func(next http.HandlerFunc) http.HandlerFunc {

		return func(w http.ResponseWriter, r *http.Request) {

			cookie, err := r.Cookie("session")
			if err != nil {
				utils.HandleAndLogError(w, r, http.StatusUnauthorized, "unauthorized")
				return
			}

			session, ok := services.Session.Get(cookie.Value)
			if !ok {
				utils.HandleAndLogError(w, r, http.StatusUnauthorized, "unauthorized")
				return
			}

			ctx := context.WithValue(
				r.Context(),
				UserContextKey,
				session,
			)

			next(w, r.WithContext(ctx))
		}
	}
}

func GetSession(r *http.Request) (infra.Session, bool) {
	s, ok := r.Context().Value(UserContextKey).(infra.Session)
	return s, ok
}
