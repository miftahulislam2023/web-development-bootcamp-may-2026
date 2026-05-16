package middlewares

import (
	"context"
	"net/http"

	jwt "github.com/golang-jwt/jwt/v5"
	"github.com/shojib116/chat-app-server/interfaces/utils"
	"github.com/shojib116/chat-app-server/internal/auth"
)

func AuthMiddleware(jwtSecret string) Middleware {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			cookie, err := r.Cookie(string(auth.AccessTokenCookie))
			if err != nil {
				utils.HandleAndLogError(w, r, http.StatusUnauthorized, "missing access token")
				return
			}

			claims := &utils.Claims{}
			token, err := jwt.ParseWithClaims(cookie.Value, claims, func(t *jwt.Token) (any, error) {
				return []byte(jwtSecret), nil
			})

			if err != nil || !token.Valid {
				utils.HandleAndLogError(w, r, http.StatusUnauthorized, "invalid or expired token")
				return
			}

			ctx := context.WithValue(r.Context(), auth.UserContextKey, auth.Session{
				UserID:   claims.UserID,
				Username: claims.Username,
			})
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func GetSessionFromContext(ctx context.Context) (auth.Session, bool) {
	session, ok := ctx.Value(auth.UserContextKey).(auth.Session)
	return session, ok
}
