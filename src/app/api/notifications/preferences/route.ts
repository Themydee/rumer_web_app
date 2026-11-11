import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";

export async function GET(request: Request) {
	try {
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
		}

		const payload = await verifyToken(token);
		if (!payload) {
			return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
		}

		const { data, error } = await supabaseAdmin
			.from("notification_settings")
			.select("in_app, push, email")
			.eq("user_id", payload.userId)
			.single();

		if (error && error.code !== "PGRST116") {
			console.error("Get notification settings error:", error);
			return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
		}

		return NextResponse.json({
			success: true,
			settings: data || { in_app: true, push: true, email: false },
		});
	} catch (error) {
		console.error("Get notification settings error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function PUT(request: Request) {
	try {
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
		}

		const payload = await verifyToken(token);
		if (!payload) {
			return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
		}

		const body = await request.json();
		const { in_app, push, email } = body;

		const { data, error } = await supabaseAdmin
			.from("notification_settings")
			.upsert(
				{
					user_id: payload.userId,
					in_app: in_app ?? true,
					push: push ?? true,
					email: email ?? false,
				},
				{ onConflict: "user_id" }
			)
			.select("in_app, push, email")
			.single();

		if (error) {
			console.error("Update notification settings error:", error);
			return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
		}

		return NextResponse.json({ success: true, settings: data });
	} catch (error) {
		console.error("Update notification settings error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}