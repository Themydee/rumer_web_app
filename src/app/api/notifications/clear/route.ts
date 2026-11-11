import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";

export async function DELETE(request: Request) {
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

		const { error } = await supabaseAdmin
			.from("notifications")
			.delete()
			.eq("user_id", payload.userId);

		if (error) {
			console.error("Clear notifications error:", error);
			return NextResponse.json({ error: "Failed to clear notifications" }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Clear notifications error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}