import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";

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

		const body = await request.json();

		// Only allow updating known profile columns
		// SEC-15: Sensitive KYC fields (is_verified, bvn, id_*, gender, state_of_origin)
		// are managed via dedicated endpoints with proper validation, not here.
		const allowed: Record<string, any> = {};
		const fields = [
			"first_name",
			"last_name",
			"phone",
			"username",
			"avatar_url",
			"business_type",
			"farm_name",
			"farm_location",
			"livestock_types",
			"date_of_birth",
		];
		for (const field of fields) {
			if (body[field] !== undefined) {
				allowed[field] = body[field];
			}
		}

		if (Object.keys(allowed).length === 0) {
			return NextResponse.json(
				{ error: "No valid fields to update" },
				{ status: 400 }
			);
		}

		// Validate username uniqueness (if being changed)
		if (allowed.username !== undefined) {
			const candidate = String(allowed.username).trim();
			if (candidate.length > 0) {
				const { data: existing } = await supabaseAdmin
					.from("profiles")
					.select("id")
					.eq("username", candidate)
					.neq("id", userId)
					.maybeSingle();

				if (existing) {
					return NextResponse.json(
						{ error: "Username is already taken" },
						{ status: 409 }
					);
				}
			}
			allowed.username = candidate.length > 0 ? candidate : null;
		}

		const { data: profile, error } = await supabaseAdmin
			.from("profiles")
			.update(allowed as any)
			.eq("id", userId)
			.select("*")
			.single();

		if (error) {
			console.error("Profile update error:", error);
			return NextResponse.json(
				{ error: "Failed to update profile" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true, profile });
	} catch (error) {
		console.error("Update profile error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
