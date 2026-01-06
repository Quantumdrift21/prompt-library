-- Optimization: Composite index for efficient incremental sync
-- This allows O(log N) fetching of records for a specific user filtered by update time.
-- Prevents full table scans during sync operations.

CREATE INDEX IF NOT EXISTS idx_prompts_user_updated 
ON prompts (user_id, updated_at DESC);
