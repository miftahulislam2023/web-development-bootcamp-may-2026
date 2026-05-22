-- +goose Up
ALTER TABLE users
ADD COLUMN password VARCHAR(255) NOT NULL;

-- +goose Down
ALTER TABLE users
DROP COLUMN IF EXISTS password;
