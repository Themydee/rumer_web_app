import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
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
			.update({ read: true })
			.eq("id", id)
			.eq("user_id", payload.userId);

		if (error) {
			console.error("Mark notification read error:", error);
			return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Mark notification read error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
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
			.eq("id", id)
			.eq("user_id", payload.userId);

		if (error) {
			console.error("Delete notification error:", error);
			return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Delete notification error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}