-- =============================================
-- RUMER: ADD username TO profiles (Custom Auth)
-- Run this in the Supabase SQL Editor after 002_bank_accounts.sql.
-- Idempotent: safe to run multiple times.
-- =============================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- Unique username (NULLs are not considered equal, so existing NULL rows are fine)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'profiles_username_key'
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
