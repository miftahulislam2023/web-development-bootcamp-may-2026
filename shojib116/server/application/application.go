package application

import (
	"database/sql"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/shojib116/chat-app-server/config"
	"github.com/shojib116/chat-app-server/infra"
	"github.com/shojib116/chat-app-server/interfaces/utils"
	"github.com/shojib116/chat-app-server/internal/auth"
	"github.com/shojib116/chat-app-server/internal/database"
)

type Services struct {
	repo *infra.Store
	cfg  *config.Config
	hub  *Hub
}

func NewServices(repo *infra.Store, cfg *config.Config, h *Hub) *Services {
	return &Services{
		repo: repo,
		cfg:  cfg,
		hub:  h,
	}
}

type FriendList []database.GetAllUsersExceptCurrentRow
type Messages []database.Message
type ChatList []database.GetConversationsForUserRow
type Conversation = database.Conversation

type ErrBadRequest struct{ Message string }
type ErrInternalServer struct{ Message string }
type ErrUnauthenticated struct{ Message string }

func (e *ErrBadRequest) Error() string      { return e.Message }
func (e *ErrInternalServer) Error() string  { return e.Message }
func (e *ErrUnauthenticated) Error() string { return e.Message }

func (s *Services) SignInUser(username string) (accessToken, refreshToken string, err error) {
	if len(username) < 1 {
		return "", "", &ErrBadRequest{Message: "invalid user name"}
	}
	user, err := s.repo.GetUserByUsername(username)
	if err != sql.ErrNoRows && err != nil {
		return "", "", &ErrInternalServer{Message: "failed to fetch user"}
	}

	if err == sql.ErrNoRows {
		user, err = s.repo.CreateUser(username)
		if err != nil {
			return "", "", &ErrInternalServer{Message: "failed to create user"}
		}
	}

	refreshToken, err = utils.GenerateToken(user.ID, user.Username, s.cfg.JWTSecret, s.cfg.RefreshTokenExpiry)
	accessToken, err = utils.GenerateToken(user.ID, user.Username, s.cfg.JWTSecret, s.cfg.AccessTokenExpiry)

	// proceed as normal even if refresh token is not saved
	s.repo.SaveRefreshToken(refreshToken, user.ID, time.Now().Add(s.cfg.RefreshTokenExpiry))

	return accessToken, refreshToken, nil
}

func (s *Services) SignOutUser(token string) error {
	err := s.repo.InvalidateRefreshToken(token)
	if err != nil {
		return &ErrInternalServer{Message: "failed to logout"}
	}

	return nil
}

func (s *Services) RefreshUser(token string) (string, error) {
	user, err := s.repo.GetUserByRefreshToken(token)
	if err == sql.ErrNoRows {
		return "", &ErrUnauthenticated{Message: "invalid refresh token"}
	} else if err != nil {
		return "", &ErrInternalServer{Message: "failed to get user"}
	}

	accessToken, err := utils.GenerateToken(user.ID, user.Username, s.cfg.JWTSecret, s.cfg.AccessTokenExpiry)
	if err != nil {
		return "", &ErrInternalServer{Message: "failed to create access token"}
	}

	return accessToken, nil
}

func (s *Services) GetFriendList(userId uuid.UUID) (FriendList, error) {
	users, err := s.repo.GetAllExceptCurrentUser(userId)
	if err != nil {
		return nil, &ErrInternalServer{Message: "failed to fetch friend list"}
	}

	return users, nil
}

func (s *Services) GetMessages(conversationId string) (Messages, error) {
	id, err := uuid.Parse(conversationId)
	if err != nil {
		return nil, &ErrBadRequest{Message: "invalid chat id"}
	}

	messages, err := s.repo.GetMessagesForAConversation(id)
	if err != nil {
		return nil, &ErrInternalServer{Message: "failed to fetch messages"}
	}

	return messages, nil
}

func (s *Services) GetChatList(userId uuid.UUID) (ChatList, error) {
	chatList, err := s.repo.GetChatListForUser(userId)
	if err != nil {
		return nil, &ErrInternalServer{Message: "failed to fetch chat list"}
	}

	return chatList, nil
}

func (s *Services) GetOrCreateConversation(user_a_id, user_b_id uuid.UUID) (*Conversation, error) {
	if strings.Compare(user_a_id.String(), user_b_id.String()) < 0 {
		user_a_id, user_b_id = user_b_id, user_a_id
	}

	conversation, err := s.repo.GetConversationByBothUser(user_a_id, user_b_id)
	if err != sql.ErrNoRows && err != nil {
		return nil, &ErrInternalServer{Message: "failed to fetch chat info"}
	}

	if err == sql.ErrNoRows {
		conversation, err = s.repo.CreateConversation(user_a_id, user_b_id)
		if err != nil {
			return nil, &ErrInternalServer{Message: "failed to fetch chat info"}
		}
	}

	return &conversation, nil
}

func (s *Services) WebSocket(c *websocket.Conn, u auth.Session) {
	client := newClient(s.hub, c, u)
	client.hub.register <- client

	go client.writePump()
	go client.readPump()

}
