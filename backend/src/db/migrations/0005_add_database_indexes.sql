-- Migration: Add Database Indexes for Performance
-- Date: 2026-01-29
-- Description: Adds indexes to improve query performance

-- Users table indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_google_id_idx ON users(google_id) WHERE google_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS users_created_at_idx ON users(created_at DESC);

-- Diaries table indexes
CREATE INDEX IF NOT EXISTS diaries_user_id_idx ON diaries(user_id);
CREATE INDEX IF NOT EXISTS diaries_unique_link_idx ON diaries(unique_link);
CREATE INDEX IF NOT EXISTS diaries_updated_at_idx ON diaries(updated_at DESC);
CREATE INDEX IF NOT EXISTS diaries_user_active_idx ON diaries(user_id, is_active);

-- Farewell notes table indexes
CREATE INDEX IF NOT EXISTS farewell_notes_diary_id_idx ON farewell_notes(diary_id);
CREATE INDEX IF NOT EXISTS farewell_notes_author_id_idx ON farewell_notes(author_id) WHERE author_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS farewell_notes_created_at_idx ON farewell_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS farewell_notes_diary_author_idx ON farewell_notes(diary_id, author_id);

-- Testimonials table indexes (already created in 0002, adding for completeness)
CREATE INDEX IF NOT EXISTS testimonials_approved_idx ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS testimonials_created_at_idx ON testimonials(created_at DESC);

-- Donations table indexes (already created in 0002, adding for completeness)
CREATE INDEX IF NOT EXISTS donations_public_idx ON donations(is_public);
CREATE INDEX IF NOT EXISTS donations_created_at_idx ON donations(created_at DESC);

-- Sessions table index (if using connect-pg-simple)
CREATE INDEX IF NOT EXISTS sessions_expire_idx ON sessions(expire);

-- Add comments
COMMENT ON INDEX users_email_idx IS 'Fast lookup for login';
COMMENT ON INDEX diaries_unique_link_idx IS 'Fast lookup for shared diary links';
COMMENT ON INDEX farewell_notes_diary_author_idx IS 'Fast lookup for contributor notes';

-- Analyze tables for query planner
ANALYZE users;
ANALYZE diaries;
ANALYZE farewell_notes;
ANALYZE testimonials;
ANALYZE donations;

-- Verify migration
DO $$
DECLARE
    index_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes
    WHERE schemaname = 'public'
    AND indexname LIKE '%_idx';
    
    IF index_count >= 10 THEN
        RAISE NOTICE 'Migration 0005: Database indexes created successfully (% indexes)', index_count;
    ELSE
        RAISE EXCEPTION 'Migration 0005: Failed to create sufficient indexes';
    END IF;
END $$;
