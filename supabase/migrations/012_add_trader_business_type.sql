-- Add 'trader' to the business_type CHECK constraint on profiles
-- Existing values: 'individual' (Farmer), 'business' (Other)
-- New value: 'trader' (Trader/Buyer)

ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_business_type_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_business_type_check
  CHECK (business_type IN ('individual', 'business', 'trader'));
