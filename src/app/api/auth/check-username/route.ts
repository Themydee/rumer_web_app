import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";

export async function GET(request: Request) {
	try {
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json(
				{ error: "Authorization token required" },
				{ status: 401 }
			);
		}

		const payload = await verifyToken(token);
		if (!payload) {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		const userId = payload.userId;
		const url = new URL(request.url);
		const raw = (url.searchParams.get("username") || "").trim();

		// Empty username is always "available" (means keep default/derived)
		if (raw.length === 0) {
			return NextResponse.json({ available: true });
		}

		const { data: existing } = await supabaseAdmin
			.from("profiles")
			.select("id")
			.eq("username", raw)
			.neq("id", userId)
			.maybeSingle();

		return NextResponse.json({ available: !existing });
	} catch (error) {
		console.error("Check username error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
