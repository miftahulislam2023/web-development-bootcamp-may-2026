-- name: CreateUser :one
INSERT INTO users(username, password)
VALUES($1, $2)
RETURNING *;

-- name: GetUserByUsername :one
SELECT * FROM users
WHERE username = $1;

-- name: GetAllUsersExceptCurrent :many
SELECT 
  users.*, 
  EXISTS (
    SELECT 1 FROM conversations
    WHERE (conversations.user_a_id = $1 AND conversations.user_b_id = users.id)
      OR (conversations.user_b_id = $1 AND conversations.user_a_id = users.id)
  ) AS is_friend
FROM users
WHERE users.id <> $1;


