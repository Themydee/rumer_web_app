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

		const {
			bvn,
			id_type,
			id_number,
			id_file_url,
			gender,
			date_of_birth,
			state_of_origin,
			is_sole_proprietor,
		} = body;

		const updatePayload: Record<string, any> = {
			kyc_tier: "tier_1",
			kyc_status: "verified",
			is_verified: true,
			updated_at: new Date().toISOString(),
		};

		if (bvn !== undefined) updatePayload.bvn = bvn;
		if (id_type !== undefined) updatePayload.id_type = id_type;
		if (id_number !== undefined) updatePayload.id_number = id_number;
		if (id_file_url !== undefined) updatePayload.id_file_url = id_file_url;
		if (gender !== undefined) updatePayload.gender = gender;
		if (date_of_birth !== undefined) updatePayload.date_of_birth = date_of_birth;
		if (state_of_origin !== undefined) updatePayload.state_of_origin = state_of_origin;
		if (is_sole_proprietor !== undefined) updatePayload.is_sole_proprietor = Boolean(is_sole_proprietor);

		const { data: profile, error } = await supabaseAdmin
			.from("profiles")
			.update(updatePayload as any)
			.eq("id", userId)
			.select("*")
			.single();

		if (error) {
			console.error("KYC Individual verification error:", error);
			return NextResponse.json(
				{ error: "Failed to update KYC status" },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Tier 1 KYC verification submitted successfully",
			profile,
		});
	} catch (error) {
		console.error("KYC individual route error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
