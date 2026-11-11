import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";

const MIGRATION_SQL = `
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

		const { error: checkError } = await supabaseAdmin
			.from("notifications")
			.select("id")
			.limit(1);

		if (!checkError) {
			return NextResponse.json({
				success: true,
				message: "Notifications tables already exist",
			});
		}

		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

		if (!supabaseUrl || !serviceKey) {
			return NextResponse.json(
				{ error: "Missing Supabase configuration" },
				{ status: 500 }
			);
		}

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
				message: "Notifications tables created successfully",
			});
		}

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
