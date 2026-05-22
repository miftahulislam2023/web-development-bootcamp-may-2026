-- Custom SQL migration file, put your code below! --

-- Enable the trigram extension
-- IF NOT EXISTS means this is safe to run multiple times
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create the GIN trigram index on display_name
-- This is what makes ILIKE '%query%' fast
-- Cannot be expressed in Drizzle schema, so it lives here
CREATE INDEX IF NOT EXISTS profile_display_name_trgm_idx
  ON user_profile
  USING gin (display_name gin_trgm_ops);