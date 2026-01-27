-- ============================================
-- FAREWELL DIARY DATABASE INITIALIZATION
-- Run this ONCE in your Supabase/Render SQL editor
-- ============================================

-- Drop existing tables if you want a fresh start (CAUTION)
-- DROP TABLE IF EXISTS farewell_notes CASCADE;
-- DROP TABLE IF EXISTS diaries CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS sessions CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  profile_picture text,
  google_id varchar(255) UNIQUE,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create diaries table
CREATE TABLE IF NOT EXISTS diaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unique_link varchar(100) NOT NULL UNIQUE,
  title varchar(255) NOT NULL,
  description text,
  is_active boolean DEFAULT true NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create farewell_notes table
CREATE TABLE IF NOT EXISTS farewell_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id uuid NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  author_name varchar(255) NOT NULL,
  author_email varchar(255) NOT NULL,
  encrypted_content text NOT NULL,
  font_style varchar(50) DEFAULT 'default',
  is_anonymous boolean DEFAULT false NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create sessions table (for connect-pg-simple)
CREATE TABLE IF NOT EXISTS sessions (
  sid varchar(255) PRIMARY KEY NOT NULL,
  sess jsonb NOT NULL,
  expire timestamp NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_diaries_user_id ON diaries(user_id);
CREATE INDEX IF NOT EXISTS idx_diaries_unique_link ON diaries(unique_link);
CREATE INDEX IF NOT EXISTS idx_farewell_notes_diary_id ON farewell_notes(diary_id);
CREATE INDEX IF NOT EXISTS idx_farewell_notes_author_id ON farewell_notes(author_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire);

-- Grant permissions (adjust if needed)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO your_user;

SELECT 'Database initialization complete!' AS status;