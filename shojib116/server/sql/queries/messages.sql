-- name: CreateMessage :one
INSERT INTO messages (text, conversation_id, sender_id, sent_at)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetAllMessages :many
SELECT * FROM messages;

-- name: GetMessagesForAConversation :many
SELECT * FROM messages 
WHERE messages.conversation_id = $1;
