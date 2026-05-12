package main

import (
	"crypto/rand"
	"encoding/hex"
	"sync"

	"github.com/google/uuid"
)

type Session struct {
	UserID   uuid.UUID `json:"userId"`
	Username string    `json:"username"`
}

type SessionStore struct {
	mu       sync.RWMutex
	sessions map[string]Session
}

func NewSession() *SessionStore {
	return &SessionStore{
		mu:       sync.RWMutex{},
		sessions: map[string]Session{},
	}
}

func (s *SessionStore) Create(user Session) string {
	id := generateToken()
	s.mu.Lock()
	s.sessions[id] = user
	s.mu.Unlock()
	return id
}

func (s *SessionStore) Get(id string) (Session, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	sess, ok := s.sessions[id]
	return sess, ok
}

func (s *SessionStore) Delete(id string) {
	s.mu.Lock()
	delete(s.sessions, id)
	s.mu.Unlock()
}

func generateToken() string {
	b := make([]byte, 32)
	rand.Read(b)
	return hex.EncodeToString(b)
}
