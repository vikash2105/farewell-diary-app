-- Migration: Add public homepage features
-- Date: 2026-01-29
-- Description: Adds testimonials and donations tables for public homepage

-- ==========================================
-- CREATE TESTIMONIALS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS "testimonials" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "name" varchar(255) NOT NULL,
  "message" text NOT NULL,
  "is_approved" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

-- ==========================================
-- CREATE DONATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS "donations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "display_name" varchar(255) NOT NULL,
  "amount" varchar(50) NOT NULL,
  "message" text,
  "payment_provider" varchar(50),
  "transaction_id" varchar(255),
  "is_anonymous" boolean NOT NULL DEFAULT false,
  "is_public" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

-- ==========================================
-- CREATE INDEXES FOR PERFORMANCE
-- ==========================================

-- Index for filtering approved testimonials
CREATE INDEX IF NOT EXISTS "testimonials_approved_idx" 
  ON "testimonials"("is_approved");

-- Index for filtering public donations
CREATE INDEX IF NOT EXISTS "donations_public_idx" 
  ON "donations"("is_public");

-- Index for ordering donations by date
CREATE INDEX IF NOT EXISTS "donations_created_at_idx" 
  ON "donations"("created_at" DESC);

-- Index for testimonials by date
CREATE INDEX IF NOT EXISTS "testimonials_created_at_idx" 
  ON "testimonials"("created_at" DESC);

-- ==========================================
-- ADD COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON TABLE "testimonials" IS 'User testimonials for public homepage';
COMMENT ON TABLE "donations" IS 'Donation records for supporters section';

COMMENT ON COLUMN "testimonials"."is_approved" IS 'Admin moderation flag - only approved testimonials shown publicly';
COMMENT ON COLUMN "donations"."is_public" IS 'Whether to show this donation in the public supporters list';
COMMENT ON COLUMN "donations"."is_anonymous" IS 'Whether donor chose to remain anonymous';
COMMENT ON COLUMN "donations"."payment_provider" IS 'Payment provider used (stripe, razorpay, etc) - internal use only';
COMMENT ON COLUMN "donations"."transaction_id" IS 'External payment transaction ID - internal use only';

-- ==========================================
-- SEED INITIAL TESTIMONIALS (OPTIONAL)
-- ==========================================
-- Uncomment the following to add sample testimonials

/*
INSERT INTO testimonials (name, message, is_approved)
VALUES 
  ('Sarah M.', 'This app helped me preserve the most precious words from my grandmother before she passed. Forever grateful.', true),
  ('John D.', 'Simple, private, and beautiful. Exactly what I needed during a difficult time.', true),
  ('Emily R.', 'The privacy features gave me peace of mind. My friends could share their thoughts without worrying about who else would see them.', true),
  ('Michael T.', 'Creating a farewell diary was one of the most meaningful things I did before my surgery. The messages I received were priceless.', true),
  ('Rachel K.', 'I love that I can keep these memories forever without worrying about privacy or data breaches.', true);
*/

-- ==========================================
-- ROLLBACK INSTRUCTIONS
-- ==========================================
-- To rollback this migration, run:
-- DROP INDEX IF EXISTS "testimonials_created_at_idx";
-- DROP INDEX IF EXISTS "donations_created_at_idx";
-- DROP INDEX IF EXISTS "donations_public_idx";
-- DROP INDEX IF EXISTS "testimonials_approved_idx";
-- DROP TABLE IF EXISTS "donations";
-- DROP TABLE IF EXISTS "testimonials";
