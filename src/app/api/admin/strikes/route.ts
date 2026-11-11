import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/components/lib/supabase/client";

export async function GET(request: NextRequest) {
	try {
		const { data: strikes, error } = await (supabase as any)
			.from("user_strikes")
			.select("*, profiles:user_id(first_name, last_name, phone, farm_name)")
			.order("issued_at", { ascending: false })
			.limit(100);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ strikes: strikes || [] });
	} catch (err: any) {
		return NextResponse.json({ error: err.message || "Failed to fetch admin strikes" }, { status: 500 });
	}
}

export async function PATCH(request: NextRequest) {
	try {
		const body = await request.json();
		const { strike_id, is_active } = body;

		if (!strike_id) {
			return NextResponse.json({ error: "Strike ID is required" }, { status: 400 });
		}

		const { data: updatedStrike, error } = await (supabase as any)
			.from("user_strikes")
			.update({ is_active: Boolean(is_active) })
			.eq("id", strike_id)
			.select()
			.single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		// Recalculate active strikes for user
		if (updatedStrike) {
			const { data: activeCnt } = await (supabase as any).rpc("get_active_strike_count", {
				p_user_id: updatedStrike.user_id,
			});

			await (supabase as any)
				.from("profiles")
				.update({ active_strikes: activeCnt || 0 })
				.eq("id", updatedStrike.user_id);
		}

		return NextResponse.json({
			message: "Strike updated successfully by admin.",
			strike: updatedStrike,
		});
	} catch (err: any) {
		return NextResponse.json({ error: err.message || "Failed to update strike" }, { status: 500 });
	}
}
