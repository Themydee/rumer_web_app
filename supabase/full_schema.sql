-- =============================================
-- RUMER DATABASE SCHEMA (Custom Auth)
-- Run this in the Supabase SQL Editor.
-- Idempotent: safe to run multiple times.
-- If you have leftover/broken tables from a previous
-- failed run, run the RESET snippet at the very bottom first.
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- TABLES (created in FK-safe order)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL DEFAULT '',
    phone TEXT DEFAULT '',
    avatar_url TEXT,
    business_type TEXT CHECK (business_type IN ('individual', 'business')),
    farm_name TEXT,
    farm_location TEXT,
    livestock_types TEXT[] DEFAULT '{}',
    id_type TEXT CHECK (id_type IN ('nin', 'passport', 'nimc')),
    id_number TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('phone', 'email')),
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    device_info JSONB,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS livestock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    breed TEXT,
    weight DECIMAL(10,2),
    age_months INTEGER,
    gender TEXT CHECK (gender IN ('male', 'female')),
    health_status TEXT,
    traceability_id TEXT UNIQUE,
    images TEXT[] DEFAULT '{}',
    price DECIMAL(12,2),
    currency TEXT DEFAULT 'NGN',
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES profiles(id),
    seller_id UUID NOT NULL REFERENCES profiles(id),
    livestock_id UUID NOT NULL REFERENCES livestock(id),
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'NGN',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT,
    reference TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_otp_codes_user_id ON otp_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_codes_code ON otp_codes(code);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_livestock_owner_id ON livestock(owner_id);
CREATE INDEX IF NOT EXISTS idx_livestock_status ON livestock(status);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);

-- =============================================
-- FUNCTIONS
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS (drop + recreate to stay idempotent)
-- =============================================
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_livestock_updated_at ON livestock;
CREATE TRIGGER update_livestock_updated_at
    BEFORE UPDATE ON livestock
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- CLEANUP FUNCTION FOR EXPIRED OTPS
-- =============================================
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void AS $$
BEGIN
    DELETE FROM otp_codes
    WHERE expires_at < NOW()
    OR (used = TRUE AND created_at < NOW() - INTERVAL '24 hours');
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestock ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users: service-role only (client has no direct access)
DROP POLICY IF EXISTS "Users can view own user" ON users;
CREATE POLICY "Users can view own user" ON users FOR SELECT USING (false);

-- Profiles: service-role only
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (false);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (false);

-- OTP codes: service-role only
DROP POLICY IF EXISTS "Service role manages OTP codes" ON otp_codes;
CREATE POLICY "Service role manages OTP codes" ON otp_codes FOR ALL USING (false);

-- Sessions: service-role only
DROP POLICY IF EXISTS "Service role manages sessions" ON sessions;
CREATE POLICY "Service role manages sessions" ON sessions FOR ALL USING (false);

-- Livestock: available items are public; writes are service-role only
DROP POLICY IF EXISTS "Anyone can view available livestock" ON livestock;
CREATE POLICY "Anyone can view available livestock" ON livestock FOR SELECT USING (status = 'available');

DROP POLICY IF EXISTS "Users can view own livestock" ON livestock;
CREATE POLICY "Users can view own livestock" ON livestock FOR SELECT USING (false);

DROP POLICY IF EXISTS "Users can insert own livestock" ON livestock;
CREATE POLICY "Users can insert own livestock" ON livestock FOR INSERT WITH CHECK (false);

DROP POLICY IF EXISTS "Users can update own livestock" ON livestock;
CREATE POLICY "Users can update own livestock" ON livestock FOR UPDATE USING (false);

DROP POLICY IF EXISTS "Users can delete own livestock" ON livestock;
CREATE POLICY "Users can delete own livestock" ON livestock FOR DELETE USING (false);

-- Transactions: service-role only
DROP POLICY IF EXISTS "Users can view own transactions as buyer" ON transactions;
CREATE POLICY "Users can view own transactions as buyer" ON transactions FOR SELECT USING (false);

DROP POLICY IF EXISTS "Users can view own transactions as seller" ON transactions;
CREATE POLICY "Users can view own transactions as seller" ON transactions FOR SELECT USING (false);

DROP POLICY IF EXISTS "Users can insert transactions" ON transactions;
CREATE POLICY "Users can insert transactions" ON transactions FOR INSERT WITH CHECK (false);

-- =============================================
-- STORAGE BUCKET FOR AVATARS
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
CREATE POLICY "Anyone can view avatars"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- =============================================
-- OPTIONAL RESET (only if you have broken leftover
-- tables from a previous failed run). Uncomment and
-- run ONCE, then run the migration above again.
-- =============================================
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
-- GRANT ALL ON SCHEMA public TO postgres;
-- GRANT ALL ON SCHEMA public TO public;
-- GRANT ALL ON SCHEMA public TO anon;
-- GRANT ALL ON SCHEMA public TO authenticated;
-- GRANT ALL ON SCHEMA public TO service_role;
-- =============================================
-- RUMER: BANK ACCOUNTS (Custom Auth)
-- Run this in the Supabase SQL Editor after 001_initial_schema.sql.
-- Idempotent: safe to run multiple times.
-- =============================================

CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    account_name TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON bank_accounts(user_id);

-- updated_at trigger (reuse existing function)
DROP TRIGGER IF EXISTS update_bank_accounts_updated_at ON bank_accounts;
CREATE TRIGGER update_bank_accounts_updated_at
    BEFORE UPDATE ON bank_accounts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Service-role only — the client never talks to Supabase directly.
-- =============================================
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages bank accounts" ON bank_accounts;
CREATE POLICY "Service role manages bank accounts" ON bank_accounts FOR ALL USING (false);
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
-- Products table for the add-product flow
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_type TEXT NOT NULL CHECK (product_type IN ('livestock', 'processed')),
    listing_type TEXT CHECK (listing_type IN ('individual', 'bulk')),
    product_name TEXT NOT NULL,
    livestock_type TEXT,
    cut_type TEXT,
    unit_size NUMERIC,
    unit_measure TEXT CHECK (unit_measure IN ('Kg', 'Pack')),
    storage_type TEXT,
    hs_code TEXT,
    base_price NUMERIC NOT NULL DEFAULT 0,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'sold')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for listing a user's products
CREATE INDEX IF NOT EXISTS idx_products_owner_id ON products(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_products_updated_at();
-- Inventory table for tracking stock items per product
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    serial_number TEXT NOT NULL,
    weight NUMERIC,
    quantity INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
    state TEXT,
    lga TEXT,
    town TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_owner_id ON inventory(owner_id);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);

CREATE OR REPLACE FUNCTION update_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS inventory_updated_at ON inventory;
CREATE TRIGGER inventory_updated_at
    BEFORE UPDATE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_updated_at();
-- Allow inventory items to be archived
ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_status_check;
ALTER TABLE inventory ADD CONSTRAINT inventory_status_check
    CHECK (status IN ('available', 'reserved', 'sold', 'archived'));
-- Add images column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
-- Add date_of_birth to profiles table for signup flow
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
-- Add KYC verification fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bvn VARCHAR(11);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender VARCHAR(10);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state_of_origin VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS id_file_url TEXT;
-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Set amickifabian@ymail.com as admin user
-- Run this after the user has signed up:
UPDATE profiles SET is_admin = TRUE WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'amickifabian@ymail.com'
);
-- Notifications tables migration

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    link TEXT,
    image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    in_app BOOLEAN NOT NULL DEFAULT TRUE,
    push BOOLEAN NOT NULL DEFAULT TRUE,
    email BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_notification_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notification_settings_updated_at ON notification_settings;
CREATE TRIGGER notification_settings_updated_at
    BEFORE UPDATE ON notification_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_notification_settings_updated_at();

-- Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" ON notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" ON notifications
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notification settings" ON notification_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification settings" ON notification_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification settings" ON notification_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
-- Add 'trader' to the business_type CHECK constraint on profiles
-- Existing values: 'individual' (Farmer), 'business' (Other)
-- New value: 'trader' (Trader/Buyer)

ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_business_type_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_business_type_check
  CHECK (business_type IN ('individual', 'business', 'trader'));
-- Flip existing notification_settings rows so email defaults ON (opt-out).
-- This aligns existing rows with the new DEFAULT TRUE on the column.
UPDATE notification_settings SET email = TRUE WHERE email = FALSE;-- =============================================
-- MIGRATION 014: FAILED ORDERS, CANCELLATIONS, WALLETS, GPS TRACKING & STRIKE SYSTEM
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT UNIQUE NOT NULL,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
    cooperative_id UUID,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_type TEXT NOT NULL DEFAULT 'livestock',
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    cancellation_fee NUMERIC(12,2) DEFAULT 3000.00,
    assessor_fee NUMERIC(12,2) DEFAULT 0,
    logistics_fee NUMERIC(12,2) DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending_confirmation' CHECK (
        status IN (
            'pending_confirmation',
            'confirmed',
            'assessor_dispatched',
            'quality_checked',
            'in_transit',
            'completed',
            'cancelled',
            'failed',
            'reassigned'
        )
    ),
    reassignment_deadline TIMESTAMPTZ,
    replacement_deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 2. ORDER FAILURES LOG TABLE
CREATE TABLE IF NOT EXISTS order_failures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    failure_type TEXT NOT NULL CHECK (
        failure_type IN (
            'buyer_cancelled_pre_confirmation',
            'buyer_cancelled_post_confirmation',
            'seller_failed_supply',
            'stock_not_ready_assessor',
            'quality_rejected_seller_fault',
            'quality_rejected_unavoidable',
            'logistics_seller_delay_disappeared',
            'buyer_rejected_quality_valid'
        )
    ),
    initiator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    penalty_amount NUMERIC(12,2) DEFAULT 0.00,
    assessor_fee_charged NUMERIC(12,2) DEFAULT 0.00,
    logistics_fee_charged NUMERIC(12,2) DEFAULT 0.00,
    notes TEXT,
    proof_images TEXT[] DEFAULT '{}',
    rerouted_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_failures_order_id ON order_failures(order_id);
CREATE INDEX IF NOT EXISTS idx_order_failures_initiator_id ON order_failures(initiator_id);

-- 3. REALTIME GPS ASSESSOR TRACKING TABLE
CREATE TABLE IF NOT EXISTS assessor_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    latitude NUMERIC(10,8) NOT NULL,
    longitude NUMERIC(11,8) NOT NULL,
    speed NUMERIC(5,2),
    heading NUMERIC(5,2),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessor_locations_order_id ON assessor_locations(order_id);
CREATE INDEX IF NOT EXISTS idx_assessor_locations_assessor_id ON assessor_locations(assessor_id);

-- 4. WALLETS AND WALLET TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    currency TEXT DEFAULT 'NGN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (
        type IN (
            'credit',
            'debit',
            'cancellation_penalty',
            'lead_commission_forfeiture',
            'assessor_payout',
            'logistics_payout',
            'refund'
        )
    ),
    amount NUMERIC(12,2) NOT NULL,
    balance_after NUMERIC(12,2) NOT NULL,
    description TEXT,
    reference TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);

-- 5. USER STRIKES TABLE (30-DAY ROLLING WINDOW)
CREATE TABLE IF NOT EXISTS user_strikes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'cooperative')),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_user_strikes_user_id ON user_strikes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_strikes_expires_at ON user_strikes(expires_at);

-- 6. USER PROFILE EXTENSIONS FOR STRIKE PENALTIES
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS active_strikes INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS confirm_twice_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS freeze_until TIMESTAMPTZ;

-- 7. FUNCTION: CALCULATE ACTIVE STRIKES IN 30-DAY ROLLING WINDOW
CREATE OR REPLACE FUNCTION get_active_strike_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    strike_cnt INTEGER;
BEGIN
    SELECT COUNT(*) INTO strike_cnt
    FROM user_strikes
    WHERE user_id = p_user_id
      AND is_active = TRUE
      AND expires_at > NOW();
    
    RETURN strike_cnt;
END;
$$ LANGUAGE plpgsql;

-- 8. FUNCTION: ISSUE STRIKE & APPLY PENALTY AUTOMATION
CREATE OR REPLACE FUNCTION issue_user_strike(
    p_user_id UUID,
    p_role TEXT,
    p_order_id UUID,
    p_reason TEXT
)
RETURNS INTEGER AS $$
DECLARE
    v_active_cnt INTEGER;
BEGIN
    -- Insert new strike with 30-day expiry
    INSERT INTO user_strikes (user_id, role, order_id, reason, issued_at, expires_at, is_active)
    VALUES (p_user_id, p_role, p_order_id, p_reason, NOW(), NOW() + INTERVAL '30 days', TRUE);

    -- Calculate updated 30-day rolling strike count
    v_active_cnt := get_active_strike_count(p_user_id);

    -- Update profile
    UPDATE profiles
    SET active_strikes = v_active_cnt,
        updated_at = NOW()
    WHERE id = p_user_id;

    -- Apply role-specific restrictions
    IF p_role = 'buyer' THEN
        IF v_active_cnt = 2 THEN
            UPDATE profiles SET confirm_twice_enabled = TRUE WHERE id = p_user_id;
        ELSIF v_active_cnt >= 3 THEN
            UPDATE profiles SET freeze_until = NOW() + INTERVAL '24 hours' WHERE id = p_user_id;
        END IF;
    ELSIF p_role IN ('seller', 'cooperative') THEN
        IF v_active_cnt = 2 THEN
            UPDATE profiles SET confirm_twice_enabled = TRUE WHERE id = p_user_id;
        ELSIF v_active_cnt >= 3 THEN
            UPDATE profiles SET freeze_until = NOW() + INTERVAL '24 hours' WHERE id = p_user_id;
        END IF;
    END IF;

    RETURN v_active_cnt;
END;
$$ LANGUAGE plpgsql;
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
