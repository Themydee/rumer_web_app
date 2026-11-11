import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { hashPassword, generateOTP, resolveUserByIdentifier } from "@/components/lib/auth-helpers";
import { sendPasswordResetOtpEmail } from "@/components/lib/email/send-email";
import { authLimiter, getRateLimitId } from "@/components/lib/rate-limit";
import type { User, Profile } from "@/components/lib/supabase/database.types";

export async function POST(request: Request) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json(
				{ error: "Email is required" },
				{ status: 400 }
			);
		}

		// SEC-11: Rate limit password reset requests
		const rateLimitId = getRateLimitId(request, email.toLowerCase());
		const { success: allowed } = authLimiter.check(rateLimitId);
		if (!allowed) {
			return NextResponse.json(
				{ error: "Too many requests. Please try again later." },
				{ status: 429 }
			);
		}

		// Resolve user (handles both real emails and phone-based identifiers)
		const user = await resolveUserByIdentifier(email);

		if (!user) {
			// Don't reveal if user exists
			return NextResponse.json({
				success: true,
				message: "If an account exists, a password reset code has been sent.",
			});
		}

		// Get profile for name
		const { data: profile } = await supabaseAdmin
			.from("profiles")
			.select("first_name")
			.eq("id", user.id)
			.single();

		// Invalidate any existing OTPs for this user
		await supabaseAdmin
			.from("otp_codes")
			.update({ used: true })
			.eq("user_id", user.id)
			.eq("type", "email")
			.eq("used", false);

		// Generate OTP for password reset
		const resetOTP = generateOTP();
		const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

		await supabaseAdmin.from("otp_codes").insert({
			user_id: user.id,
			code: resetOTP,
			type: "email",
			expires_at: expiresAt.toISOString(),
		});

		// Send password reset email
		await sendPasswordResetOtpEmail({
			name: profile?.first_name || "User",
			email,
			otp: resetOTP,
		});

		return NextResponse.json({
			success: true,
			message: "If an account exists, a password reset code has been sent.",
		});
	} catch (error) {
		console.error("Forgot password error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
