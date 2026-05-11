-- name: CreateUser :one
INSERT INTO users(username)
VALUES($1)
RETURNING *;

-- name: GetUserByUsername :one
SELECT * FROM users
WHERE username = $1;
