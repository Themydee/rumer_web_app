import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_type TEXT NOT NULL CHECK (product_type IN ('livestock', 'processed')),
    listing_type TEXT CHECK (listing_type IN ('individual', 'bulk')),
    product_name TEXT NOT NULL,
    livestock_type TEXT,
    cut_type TEXT,
    age INTEGER,
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

CREATE INDEX IF NOT EXISTS idx_products_owner_id ON products(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

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
`;

export async function POST(request: Request) {
	try {
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const payload = await verifyToken(token);
		if (!payload) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// SEC-14: Only admins can run setup/migration endpoints
		const { data: requesterProfile } = await supabaseAdmin
			.from("profiles")
			.select("is_admin")
			.eq("id", payload.userId)
			.single();

		if (!requesterProfile?.is_admin) {
			return NextResponse.json({ error: "Admin access required" }, { status: 403 });
		}

		// Check if table already exists
		const { error: checkError } = await supabaseAdmin
			.from("products")
			.select("id")
			.limit(1);

		if (!checkError) {
			return NextResponse.json({
				success: true,
				message: "Products table already exists",
			});
		}

		// Table doesn't exist — try to create it via Supabase SQL API
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

		if (!supabaseUrl || !serviceKey) {
			return NextResponse.json(
				{ error: "Missing Supabase configuration" },
				{ status: 500 }
			);
		}

		// Try the /sql endpoint
		const sqlRes = await fetch(`${supabaseUrl}/sql`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				apikey: serviceKey,
				Authorization: `Bearer ${serviceKey}`,
			},
			body: JSON.stringify({ query: MIGRATION_SQL }),
		});

		if (sqlRes.ok) {
			return NextResponse.json({
				success: true,
				message: "Products table created successfully",
			});
		}

		// Try alternative: /rest/v1/rpc with a makeshift SQL executor
		const errText = await sqlRes.text();
		console.error("SQL API failed:", sqlRes.status, errText);

		return NextResponse.json(
			{
				error: "Auto-setup failed. Please run the SQL manually in the Supabase SQL Editor.",
				details: errText,
			},
			{ status: 500 }
		);
	} catch (error) {
		console.error("Setup error:", error);
		return NextResponse.json({ error: "Setup failed" }, { status: 500 });
	}
}
