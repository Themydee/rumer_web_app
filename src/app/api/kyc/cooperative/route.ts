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
			cooperativeName,
			cacRegistrationNumber,
			tin,
			constitutionUrl,
			officers,
			authorityLetterUrl,
			bankName,
			accountNumber,
			accountName,
			governanceRulesUrl,
			isEewylaCluster,
			eewylaFileUrl,
		} = body;

		if (!cooperativeName) {
			return NextResponse.json(
				{ error: "Cooperative name is required" },
				{ status: 400 }
			);
		}

		// Insert cooperative record
		const { data: coop, error: coopError } = await supabaseAdmin
			.from("cooperatives")
			.insert({
				name: cooperativeName,
				cac_registration_number: cacRegistrationNumber || null,
				tin: tin || null,
				constitution_url: constitutionUrl || null,
				officers: officers || [],
				authority_letter_url: authorityLetterUrl || null,
				bank_name: bankName || null,
				account_number: accountNumber || null,
				account_name: accountName || null,
				governance_rules_url: governanceRulesUrl || null,
				is_eewyla_cluster: Boolean(isEewylaCluster),
				eewyla_file_url: eewylaFileUrl || null,
				status: "verified",
				lead_user_id: userId,
			} as any)
			.select("*")
			.single();

		if (coopError) {
			console.error("Failed to insert cooperative record:", coopError);
			return NextResponse.json(
				{ error: "Failed to save cooperative data" },
				{ status: 500 }
			);
		}

		// Update user profile to Tier 2
		const { data: profile, error: profileError } = await supabaseAdmin
			.from("profiles")
			.update({
				kyc_tier: "tier_2",
				kyc_status: "verified",
				cooperative_id: coop.id,
				is_verified: true,
				updated_at: new Date().toISOString(),
			} as any)
			.eq("id", userId)
			.select("*")
			.single();

		if (profileError) {
			console.error("Failed to update profile to Tier 2:", profileError);
		}

		return NextResponse.json({
			success: true,
			message: "Tier 2 Cooperative verification submitted and verified successfully",
			cooperative: coop,
			profile,
		});
	} catch (error) {
		console.error("KYC cooperative route error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
