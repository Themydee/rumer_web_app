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
			businessName,
			cacNumber,
			cacFileUrl,
			cacStatus,
			bankName,
			accountNumber,
			accountName,
			proofOfAddressType,
			proofOfAddressFileUrl,
			declarationConsent,
			termsConsent,
		} = body;

		if (!businessName) {
			return NextResponse.json(
				{ error: "Business name is required" },
				{ status: 400 }
			);
		}

		// Insert or update business verification record
		const { data: bz, error: bzError } = await supabaseAdmin
			.from("business_verifications")
			.insert({
				user_id: userId,
				business_name: businessName,
				cac_number: cacNumber || null,
				cac_file_url: cacFileUrl || null,
				cac_status: cacStatus || null,
				bank_name: bankName || null,
				account_number: accountNumber || null,
				account_name: accountName || null,
				proof_of_address_type: proofOfAddressType || null,
				proof_of_address_file_url: proofOfAddressFileUrl || null,
				declaration_consent: Boolean(declarationConsent),
				terms_consent: Boolean(termsConsent),
				status: "verified",
			} as any)
			.select("*")
			.single();

		if (bzError) {
			console.error("Failed to insert business verification record:", bzError);
			return NextResponse.json(
				{ error: "Failed to save business verification data" },
				{ status: 500 }
			);
		}

		// Update user profile to Tier 3
		const { data: profile, error: profileError } = await supabaseAdmin
			.from("profiles")
			.update({
				kyc_tier: "tier_3",
				kyc_status: "verified",
				business_type: "business",
				is_verified: true,
				updated_at: new Date().toISOString(),
			} as any)
			.eq("id", userId)
			.select("*")
			.single();

		if (profileError) {
			console.error("Failed to update profile to Tier 3:", profileError);
		}

		return NextResponse.json({
			success: true,
			message: "Tier 3 Registered Business verification submitted and verified successfully",
			businessVerification: bz,
			profile,
		});
	} catch (error) {
		console.error("KYC business route error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
