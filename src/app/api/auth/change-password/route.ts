import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken, hashPassword } from "@/components/lib/auth-helpers";
import type { User } from "@/components/lib/supabase/database.types";

export async function POST(request: Request) {
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

		const { currentPassword, newPassword } = await request.json();

		if (!currentPassword || !newPassword) {
			return NextResponse.json(
				{ error: "Current and new passwords are required" },
				{ status: 400 }
			);
		}

		// Get user
		const { data: user, error: userError } = await supabaseAdmin
			.from("users")
			.select("password_hash")
			.eq("id", userId)
			.single();

		if (userError || !user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		// Verify current password
		const { comparePassword } = await import("@/components/lib/auth-helpers");
		const isValid = await comparePassword(currentPassword, user.password_hash);
		if (!isValid) {
			return NextResponse.json(
				{ error: "Current password is incorrect" },
				{ status: 400 }
			);
		}

		// Hash new password
		const newPasswordHash = await hashPassword(newPassword);

		// Update password
		await supabaseAdmin
			.from("users")
			.update({ password_hash: newPasswordHash })
			.eq("id", userId);

		// SEC-05: Invalidate ALL sessions (including current) — force re-login
		await supabaseAdmin
			.from("sessions")
			.delete()
			.eq("user_id", userId);

		return NextResponse.json({
			success: true,
			message: "Password updated successfully",
		});
	} catch (error) {
		console.error("Change password error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
