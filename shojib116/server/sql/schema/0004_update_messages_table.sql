-- +goose Up
ALTER TABLE messages
ADD COLUMN conversation_id UUID NOT NULL,
ADD COLUMN sender_id UUID NOT NULL,
ADD CONSTRAINT fk_conversation
  FOREIGN KEY (conversation_id)
  REFERENCES conversations(id)
  ON DELETE CASCADE,
ADD CONSTRAINT fk_sender
  FOREIGN KEY (sender_id)
  REFERENCES users(id)
  ON DELETE CASCADE;

-- +goose Down
ALTER TABLE messages
DROP CONSTRAINT IF EXISTS fk_conversation,
DROP CONSTRAINT IF EXISTS fk_sender,
DROP COLUMN IF EXISTS conversation_id,
DROP COLUMN IF EXISTS sender_id;
