import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken, generateToken } from "@/components/lib/auth-helpers";
import { authLimiter, getRateLimitId } from "@/components/lib/rate-limit";

export async function POST(request: Request) {
	try {
		const { code, email } = await request.json();

		if (!code || !email) {
			return NextResponse.json(
				{ error: "Code and email are required" },
				{ status: 400 }
			);
		}

		// SEC-06: Rate limit OTP verification attempts
		const rateLimitId = getRateLimitId(request, email.toLowerCase());
		const { success: allowed } = authLimiter.check(rateLimitId);
		if (!allowed) {
			return NextResponse.json(
				{ error: "Too many attempts. Please try again later." },
				{ status: 429 }
			);
		}

		// Get user
		const { data: user } = await supabaseAdmin
			.from("users")
			.select("id")
			.eq("email", email.toLowerCase())
			.single();

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		// Get valid OTP
		const { data: otpCode, error: otpError } = await supabaseAdmin
			.from("otp_codes")
			.select("*")
			.eq("user_id", user.id)
			.eq("code", code)
			.eq("type", "email")
			.eq("used", false)
			.gt("expires_at", new Date().toISOString())
			.single();

		if (otpError || !otpCode) {
			return NextResponse.json(
				{ error: "Invalid or expired code" },
				{ status: 400 }
			);
		}

		// Mark OTP as used
		await supabaseAdmin
			.from("otp_codes")
			.update({ used: true })
			.eq("id", otpCode.id);

		// Update user email verification status
		await supabaseAdmin
			.from("users")
			.update({ is_email_verified: true })
			.eq("id", user.id);

		// SEC-06: Reset rate limiter on successful verification
		authLimiter.reset(rateLimitId);

		// Generate new token
		const token = await generateToken(user.id);

		// Create session
		await supabaseAdmin.from("sessions").insert({
			user_id: user.id,
			token,
			expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
		});

		return NextResponse.json({
			success: true,
			token,
			message: "Email verified successfully",
		});
	} catch (error) {
		console.error("Verify email error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
