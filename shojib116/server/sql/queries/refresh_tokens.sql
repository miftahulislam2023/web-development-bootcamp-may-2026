-- name: CreateRefreshToken :exec
INSERT INTO refresh_tokens (token_hash, user_id, expires_at)
VALUES ($1, $2, $3);

-- name: GetUserByRefreshToken :one
SELECT u.* FROM users u
JOIN refresh_tokens rt ON u.id = rt.user_id
WHERE rt.token_hash = $1 
  AND rt.expires_at > NOW()
  AND u.is_verified = true;

-- name: InvalidateToken :exec
UPDATE refresh_tokens SET is_valid = FALSE WHERE token_hash = $1;


