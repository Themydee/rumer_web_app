import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";
import type { User, Profile } from "@/components/lib/supabase/database.types";

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

		// Get user
		const { data: user, error: userError } = await supabaseAdmin
			.from("users")
			.select("id, email, is_email_verified, created_at")
			.eq("id", userId)
			.single();

		if (userError || !user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		// Get profile
		const { data: profile, error: profileError } = await supabaseAdmin
			.from("profiles")
			.select("*")
			.eq("id", userId)
			.single();

		if (profileError && !process.env.NODE_ENV?.includes("test")) {
			// Log error but don't fail - profile might not exist yet
			console.warn("Profile not found for user:", userId);
		}

		return NextResponse.json({
			success: true,
			user: {
				...user,
				profile: profile || null,
			},
		});
	} catch (error) {
		console.error("Get user error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
