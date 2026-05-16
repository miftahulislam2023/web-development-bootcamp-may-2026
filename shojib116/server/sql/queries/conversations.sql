-- name: CreateConversation :one
INSERT INTO conversations(user_a_id, user_b_id)
VALUES($1, $2)
RETURNING *;

-- name: GetConversationByBothUserId :one
SELECT * FROM conversations
WHERE user_a_id = $1
  AND user_b_id = $2;

-- name: GetConversationsForUser :many
SELECT
    conversations.id AS conversation_id,
    users.id AS user_id,
    users.username
FROM conversations
JOIN users
ON users.id =
    CASE
        WHEN conversations.user_a_id = $1
            THEN conversations.user_b_id
        ELSE conversations.user_a_id
    END
WHERE conversations.user_a_id = $1
   OR conversations.user_b_id = $1;
