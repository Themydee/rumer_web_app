-- Add date_of_birth to profiles table for signup flow
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
