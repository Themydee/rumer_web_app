-- Migration: 015_kyc_tiers_system.sql
-- Description: Implement 4-tier KYC framework (Tier 0 to Tier 3), Cooperatives, and Business Verifications

-- 1. Create cooperatives table
CREATE TABLE IF NOT EXISTS cooperatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    cac_registration_number VARCHAR(100),
    tin VARCHAR(100),
    constitution_url TEXT,
    officers JSONB DEFAULT '[]'::jsonb,
    authority_letter_url TEXT,
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    account_name VARCHAR(255),
    governance_rules_url TEXT,
    is_eewyla_cluster BOOLEAN DEFAULT FALSE,
    eewyla_file_url TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    rejection_reason TEXT,
    lead_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create business_verifications table
CREATE TABLE IF NOT EXISTS business_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    cac_number VARCHAR(100),
    cac_file_url TEXT,
    cac_status VARCHAR(50),
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    account_name VARCHAR(255),
    proof_of_address_type VARCHAR(100),
    proof_of_address_file_url TEXT,
    declaration_consent BOOLEAN DEFAULT FALSE,
    terms_consent BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add KYC tier and cooperative columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_tier VARCHAR(20) NOT NULL DEFAULT 'tier_0';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(50) NOT NULL DEFAULT 'unverified';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cooperative_id UUID REFERENCES cooperatives(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_sole_proprietor BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_rejection_reason TEXT;

-- 4. Backfill existing verified profiles to Tier 1
UPDATE profiles 
SET kyc_tier = 'tier_1', kyc_status = 'verified'
WHERE is_verified = TRUE;

-- 5. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_profiles_kyc_tier ON profiles(kyc_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_cooperative_id ON profiles(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_cooperatives_status ON cooperatives(status);
CREATE INDEX IF NOT EXISTS idx_business_verifications_user_id ON business_verifications(user_id);
