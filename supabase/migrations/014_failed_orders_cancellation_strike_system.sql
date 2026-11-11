-- =============================================
-- MIGRATION 014: FAILED ORDERS, CANCELLATIONS, WALLETS, GPS TRACKING & STRIKE SYSTEM
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
