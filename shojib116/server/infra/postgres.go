package infra

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
	"github.com/shojib116/chat-app-server/internal/database"
)

type Store struct {
	db *sql.DB
	q  *database.Queries
}

func NewStore(db *sql.DB) *Store {
	return &Store{
		db: db,
		q:  database.New(db),
	}
}

func (s *Store) GetUserByUsername(username string) (database.User, error) {
	return s.q.GetUserByUsername(context.Background(), username)
}

func (s *Store) CreateUser(username, password string) (database.User, error) {
	return s.q.CreateUser(context.Background(), database.CreateUserParams{
		Username: username,
		Password: password,
	})
}

func (s *Store) GetAllExceptCurrentUser(userId uuid.UUID) ([]database.GetAllUsersExceptCurrentRow, error) {
	return s.q.GetAllUsersExceptCurrent(context.Background(), userId)
}

func (s *Store) GetMessagesForAConversation(conversationId uuid.UUID) ([]database.Message, error) {
	return s.q.GetMessagesForAConversation(context.Background(), conversationId)
}

func (s *Store) GetChatListForUser(userId uuid.UUID) ([]database.GetConversationsForUserRow, error) {
	return s.q.GetConversationsForUser(context.Background(), userId)
}

func (s *Store) GetConversationByBothUser(user_a_id, user_b_id uuid.UUID) (database.Conversation, error) {
	return s.q.GetConversationByBothUserId(context.Background(), database.GetConversationByBothUserIdParams{
		UserAID: user_a_id,
		UserBID: user_b_id,
	})
}

func (s *Store) CreateMessage(text string, senderId, conversationId uuid.UUID, sentAt time.Time) (database.Message, error) {
	return s.q.CreateMessage(context.Background(), database.CreateMessageParams{
		Text:           text,
		SentAt:         sentAt,
		SenderID:       senderId,
		ConversationID: conversationId,
	})

}

func (s *Store) CreateConversation(user_a_id, user_b_id uuid.UUID) (database.Conversation, error) {
	return s.q.CreateConversation(context.Background(), database.CreateConversationParams{
		UserAID: user_a_id,
		UserBID: user_b_id,
	})
}

func (s *Store) SaveRefreshToken(token_hash string, userId uuid.UUID, expiresAt time.Time) error {
	return s.q.CreateRefreshToken(context.Background(), database.CreateRefreshTokenParams{
		TokenHash: token_hash,
		UserID:    userId,
		ExpiresAt: expiresAt,
	})
}

func (s *Store) InvalidateRefreshToken(token_hash string) error {
	return s.q.InvalidateToken(context.Background(), token_hash)
}

func (s *Store) GetUserByRefreshToken(token_hash string) (database.User, error) {
	return s.q.GetUserByRefreshToken(context.Background(), token_hash)
}
