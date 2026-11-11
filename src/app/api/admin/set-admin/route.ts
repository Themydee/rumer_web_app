import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";

export async function POST(request: Request) {
	try {
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json({ error: "Authorization required" }, { status: 401 });
		}

		const payload = await verifyToken(token);
		if (!payload) {
			return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
		}

		// SEC-03: Only existing admins can promote other users to admin
		const { data: requesterProfile } = await supabaseAdmin
			.from("profiles")
			.select("is_admin")
			.eq("id", payload.userId)
			.single();

		if (!requesterProfile?.is_admin) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		const { email } = await request.json();

		if (!email) {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		// Find the user by email
		const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
		if (userError) {
			return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
		}

		const user = users?.users?.find((u) => u.email === email.toLowerCase());
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Prevent self-promotion/demotion confusion
		if (user.id === payload.userId) {
			return NextResponse.json(
				{ error: "Cannot modify your own admin status" },
				{ status: 400 }
			);
		}

		// Update the profile to set is_admin = true
		const { error: updateError } = await supabaseAdmin
			.from("profiles")
			.update({ is_admin: true })
			.eq("id", user.id);

		if (updateError) {
			return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
		}

		return NextResponse.json({ success: true, message: `User ${email} is now an admin` });
	} catch (error) {
		console.error("Set admin error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
