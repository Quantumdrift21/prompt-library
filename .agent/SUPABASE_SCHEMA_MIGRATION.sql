-- =============================================
-- Prompt Library - Supabase Schema Optimization
-- Run in Supabase SQL Editor
-- =============================================

-- =========================================
-- 1. ADD CONTENT HASH FOR DEDUPLICATION
-- =========================================

-- Add content_hash column for duplicate detection
ALTER TABLE prompts 
ADD COLUMN IF NOT EXISTS content_hash TEXT;

-- Create function to generate hash from title + content
CREATE OR REPLACE FUNCTION generate_prompt_hash(title TEXT, content TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN md5(lower(trim(regexp_replace(title, '\s+', ' ', 'g'))) || '|||' || 
               lower(trim(regexp_replace(content, '\s+', ' ', 'g'))));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update existing prompts with their hash
UPDATE prompts 
SET content_hash = generate_prompt_hash(title, content)
WHERE content_hash IS NULL;

-- Create unique constraint on (user_id, content_hash) to prevent future duplicates
-- Note: This allows same content for different users, but prevents duplicates per user
ALTER TABLE prompts 
ADD CONSTRAINT unique_user_content_hash 
UNIQUE (user_id, content_hash);

-- Create trigger to auto-generate hash on insert/update
CREATE OR REPLACE FUNCTION update_content_hash()
RETURNS TRIGGER AS $$
BEGIN
    NEW.content_hash := generate_prompt_hash(NEW.title, NEW.content);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_content_hash ON prompts;
CREATE TRIGGER trigger_update_content_hash
    BEFORE INSERT OR UPDATE ON prompts
    FOR EACH ROW
    EXECUTE FUNCTION update_content_hash();


-- =========================================
-- 2. ADD VERSIONING COLUMNS
-- =========================================

-- Add version tracking for prompt evolution
ALTER TABLE prompts
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Add parent_id for version lineage (optional - for "fork" functionality)
ALTER TABLE prompts
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES prompts(id) ON DELETE SET NULL;

-- Index for finding versions of a prompt
CREATE INDEX IF NOT EXISTS idx_prompts_parent_id ON prompts(parent_id);


-- =========================================
-- 3. ADD USAGE TRACKING COLUMNS
-- =========================================

-- Add use_count for quick sorting by popularity
ALTER TABLE prompts
ADD COLUMN IF NOT EXISTS use_count INTEGER DEFAULT 0;

-- Add last_used_at for recency sorting
ALTER TABLE prompts
ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMPTZ;

-- Index for popularity queries
CREATE INDEX IF NOT EXISTS idx_prompts_use_count ON prompts(use_count DESC);

-- Index for recency queries
CREATE INDEX IF NOT EXISTS idx_prompts_last_used ON prompts(last_used_at DESC NULLS LAST);


-- =========================================
-- 4. FULL-TEXT SEARCH INDEXES (GIN)
-- =========================================

-- Create GIN index on tags for fast array containment queries
CREATE INDEX IF NOT EXISTS idx_prompts_tags_gin ON prompts USING GIN(tags);

-- Create tsvector column for full-text search
ALTER TABLE prompts
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Populate search vector
UPDATE prompts 
SET search_vector = 
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'C')
WHERE search_vector IS NULL;

-- Create GIN index on search vector
CREATE INDEX IF NOT EXISTS idx_prompts_search_gin ON prompts USING GIN(search_vector);

-- Trigger to keep search vector updated
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.content, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_search_vector ON prompts;
CREATE TRIGGER trigger_update_search_vector
    BEFORE INSERT OR UPDATE ON prompts
    FOR EACH ROW
    EXECUTE FUNCTION update_search_vector();


-- =========================================
-- 5. COLLECTIONS FINALIZATION
-- =========================================

-- Ensure collections table exists with proper structure
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT 'purple',
    icon TEXT DEFAULT '📁',
    parent_id UUID REFERENCES collections(id) ON DELETE SET NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for user's collections
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);

-- Index for hierarchical queries
CREATE INDEX IF NOT EXISTS idx_collections_parent_id ON collections(parent_id);

-- Ensure prompts.collection_id references collections
ALTER TABLE prompts
ADD COLUMN IF NOT EXISTS collection_id UUID REFERENCES collections(id) ON DELETE SET NULL;

-- Index for collection membership
CREATE INDEX IF NOT EXISTS idx_prompts_collection_id ON prompts(collection_id);


-- =========================================
-- 6. PERFORMANCE INDEXES
-- =========================================

-- Composite index for common query: user's active prompts sorted by update
CREATE INDEX IF NOT EXISTS idx_prompts_user_active_updated 
ON prompts(user_id, updated_at DESC) 
WHERE deleted_at IS NULL;

-- Index for favorites
CREATE INDEX IF NOT EXISTS idx_prompts_user_favorites 
ON prompts(user_id, updated_at DESC) 
WHERE favorite = true AND deleted_at IS NULL;

-- Index for drafts
CREATE INDEX IF NOT EXISTS idx_prompts_user_drafts 
ON prompts(user_id, updated_at DESC) 
WHERE is_draft = true AND deleted_at IS NULL;


-- =========================================
-- 7. USAGE LOGS TABLE (If not exists)
-- =========================================

CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('copy', 'use', 'duplicate')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for prompt usage queries
CREATE INDEX IF NOT EXISTS idx_usage_logs_prompt_id ON usage_logs(prompt_id);

-- Index for user activity queries
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_created ON usage_logs(user_id, created_at DESC);


-- =========================================
-- 8. RLS POLICIES (Row Level Security)
-- =========================================

-- Enable RLS on all tables
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Prompts: Users can only access their own prompts
DROP POLICY IF EXISTS prompts_user_policy ON prompts;
CREATE POLICY prompts_user_policy ON prompts
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Collections: Users can only access their own collections
DROP POLICY IF EXISTS collections_user_policy ON collections;
CREATE POLICY collections_user_policy ON collections
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Usage Logs: Users can only access their own logs
DROP POLICY IF EXISTS usage_logs_user_policy ON usage_logs;
CREATE POLICY usage_logs_user_policy ON usage_logs
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);


-- =========================================
-- 9. HELPER FUNCTIONS
-- =========================================

-- Function to increment use_count and update last_used_at atomically
CREATE OR REPLACE FUNCTION record_prompt_usage(prompt_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE prompts 
    SET 
        use_count = use_count + 1,
        last_used_at = now()
    WHERE id = prompt_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for full-text search
CREATE OR REPLACE FUNCTION search_prompts(
    search_query TEXT,
    user_uuid UUID,
    result_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content TEXT,
    tags TEXT[],
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.content,
        p.tags,
        ts_rank(p.search_vector, plainto_tsquery('english', search_query)) AS rank
    FROM prompts p
    WHERE 
        p.user_id = user_uuid
        AND p.deleted_at IS NULL
        AND p.search_vector @@ plainto_tsquery('english', search_query)
    ORDER BY rank DESC
    LIMIT result_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================================
-- 10. CLEANUP DUPLICATES (One-time)
-- =========================================

-- Identify and mark duplicates for review (keeps newest)
-- Run this as a one-time cleanup AFTER adding content_hash

-- This CTE finds all duplicates and marks all but the newest for deletion
WITH ranked_duplicates AS (
    SELECT 
        id,
        user_id,
        content_hash,
        ROW_NUMBER() OVER (
            PARTITION BY user_id, content_hash 
            ORDER BY 
                COALESCE(array_length(tags, 1), 0) DESC,
                updated_at DESC
        ) as rn
    FROM prompts
    WHERE deleted_at IS NULL
)
UPDATE prompts 
SET deleted_at = now()
WHERE id IN (
    SELECT id FROM ranked_duplicates WHERE rn > 1
);

-- Report how many were soft-deleted
SELECT 
    (SELECT COUNT(*) FROM prompts WHERE deleted_at IS NOT NULL) as soft_deleted_count,
    (SELECT COUNT(*) FROM prompts WHERE deleted_at IS NULL) as active_count;
