import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/components/lib/supabase/client";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json({ error: "User ID parameter is required" }, { status: 400 });
		}

		// 1. Fetch user active profile info
		const { data: profile, error: profileErr } = await (supabase as any)
			.from("profiles")
			.select("id, active_strikes, confirm_twice_enabled, freeze_until")
			.eq("id", userId)
			.single();

		if (profileErr) {
			console.error("Error fetching user profile strikes:", profileErr);
		}

		// 2. Fetch active strikes in 30-day window
		const nowIso = new Date().toISOString();
		const { data: activeStrikes, error: strikeErr } = await (supabase as any)
			.from("user_strikes")
			.select("*")
			.eq("user_id", userId)
			.eq("is_active", true)
			.gt("expires_at", nowIso)
			.order("issued_at", { ascending: false });

		if (strikeErr) {
			console.error("Error fetching active strikes:", strikeErr);
		}

		// 3. Fetch past strike history (expired/resolved)
		const { data: strikeHistory } = await (supabase as any)
			.from("user_strikes")
			.select("*")
			.eq("user_id", userId)
			.order("issued_at", { ascending: false })
			.limit(20);

		const activeCount = activeStrikes ? activeStrikes.length : 0;
		const isFrozen = profile?.freeze_until ? new Date(profile.freeze_until) > new Date() : false;

		return NextResponse.json({
			userId,
			activeCount,
			confirmTwiceEnabled: profile?.confirm_twice_enabled || activeCount >= 2,
			isFrozen,
			freezeUntil: profile?.freeze_until || null,
			activeStrikes: activeStrikes || [],
			strikeHistory: strikeHistory || [],
		});
	} catch (err: any) {
		return NextResponse.json({ error: err.message || "Failed to fetch user strikes" }, { status: 500 });
	}
}
