-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Set amickifabian@ymail.com as admin user
-- Run this after the user has signed up:
UPDATE profiles SET is_admin = TRUE WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'amickifabian@ymail.com'
);
