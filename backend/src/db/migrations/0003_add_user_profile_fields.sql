-- Migration: Add User Profile Fields
-- Date: 2026-01-29
-- Description: Adds username and bio fields to users table

-- Add username column (unique, optional)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;

-- Add bio column (optional)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Create index for username lookups (only for non-null usernames)
CREATE INDEX IF NOT EXISTS users_username_idx 
ON users(username) 
WHERE username IS NOT NULL;

-- Add comments
COMMENT ON COLUMN users.username IS 'Unique username for user profile (optional)';
COMMENT ON COLUMN users.bio IS 'User biography/about me text (max 500 characters)';

-- Verify migration
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'username'
    ) THEN
        RAISE NOTICE 'Migration 0003: User profile fields added successfully';
    ELSE
        RAISE EXCEPTION 'Migration 0003: Failed to add user profile fields';
    END IF;
END $$;
