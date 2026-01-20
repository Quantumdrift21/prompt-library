-- Add deleted_at column to prompts table for soft delete support
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Index for querying active/deleted prompts efficiently
CREATE INDEX IF NOT EXISTS prompts_deleted_at_idx ON prompts(deleted_at);
