package auth

import "github.com/google/uuid"

type Session struct {
	UserID   uuid.UUID `json:"user_id"`
	Username string    `json:"username"`
}

type contextKey string

const UserContextKey contextKey = "user"

type CookieName string

const AccessTokenCookie CookieName = "access_token"
const RefreshTokenCookie CookieName = "refresh_token"
