-- Add KYC verification fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bvn VARCHAR(11);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender VARCHAR(10);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state_of_origin VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS id_file_url TEXT;
