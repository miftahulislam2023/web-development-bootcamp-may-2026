package application

import (
	"database/sql"
	"strings"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/shojib116/chat-app-server/config"
	"github.com/shojib116/chat-app-server/infra"
	"github.com/shojib116/chat-app-server/internal/database"
)

type Services struct {
	repo    *infra.Store
	cfg     *config.Config
	Session *infra.SessionStore
	hub     *Hub
}

func NewServices(repo *infra.Store, cfg *config.Config, ss *infra.SessionStore, h *Hub) *Services {
	return &Services{
		repo:    repo,
		cfg:     cfg,
		Session: ss,
		hub:     h,
	}
}

type FriendList []database.GetAllUsersExceptCurrentRow
type Messages []database.Message
type ChatList []database.GetConversationsForUserRow
type Conversation = database.Conversation

type ErrBadRequest struct{ Message string }
type ErrInternalServer struct{ Message string }

func (e *ErrBadRequest) Error() string     { return e.Message }
func (e *ErrInternalServer) Error() string { return e.Message }

func (s *Services) SignInUser(username string) (string, error) {
	if len(username) < 1 {
		return "", &ErrBadRequest{Message: "invalid user name"}
	}
	user, err := s.repo.GetUserByUsername(username)
	if err != sql.ErrNoRows && err != nil {
		return "", &ErrInternalServer{Message: "failed to fetch user"}
	}

	if err == sql.ErrNoRows {
		user, err = s.repo.CreateUser(username)
		if err != nil {
			return "", &ErrInternalServer{Message: "failed to create user"}
		}
	}

	sessionId := s.Session.Create(infra.Session{
		UserID:   user.ID,
		Username: user.Username,
	})

	return sessionId, nil
}

func (s *Services) SignOutUser(value string) {
	s.Session.Delete(value)
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

func (s *Services) WebSocket(c *websocket.Conn, u *infra.Session) {
	client := NewClient(s.hub, c, u)
	client.hub.register <- client

	go client.writePump()
	go client.readPump()

}
