-- name: CreateMessage :one
INSERT INTO messages (text, sent_at)
VALUES ($1, $2)
RETURNING *;

-- name: GetAllMessages :many
SELECT * FROM messages;
