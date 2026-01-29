-- Migration: Add Note Metadata
-- Date: 2026-01-29
-- Description: Adds metadata field to farewell_notes for stickers, formatting, etc.

-- Add metadata column (JSONB for flexible storage)
ALTER TABLE farewell_notes 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Create GIN index for faster JSONB queries
CREATE INDEX IF NOT EXISTS farewell_notes_metadata_idx 
ON farewell_notes USING gin(metadata);

-- Add comment
COMMENT ON COLUMN farewell_notes.metadata IS 'JSON metadata for note customization (stickers, colors, etc.)';

-- Verify migration
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'farewell_notes' 
        AND column_name = 'metadata'
    ) THEN
        RAISE NOTICE 'Migration 0004: Note metadata field added successfully';
    ELSE
        RAISE EXCEPTION 'Migration 0004: Failed to add note metadata field';
    END IF;
END $$;
