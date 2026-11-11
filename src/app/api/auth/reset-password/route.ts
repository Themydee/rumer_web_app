import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { hashPassword, generateToken, resolveUserByIdentifier } from "@/components/lib/auth-helpers";
import { authLimiter, getRateLimitId } from "@/components/lib/rate-limit";
import type { User } from "@/components/lib/supabase/database.types";

export async function POST(request: Request) {
	try {
		const { email, code, newPassword } = await request.json();

		if (!email || !code || !newPassword) {
			return NextResponse.json(
				{ error: "Email, code, and new password are required" },
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

		// Resolve user (handles both real emails and phone-based identifiers)
		const user = await resolveUserByIdentifier(email);

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

		// Hash new password
		const passwordHash = await hashPassword(newPassword);

		// Update password
		await supabaseAdmin
			.from("users")
			.update({ password_hash: passwordHash })
			.eq("id", user.id);

		// SEC-06: Reset rate limiter on successful password reset
		authLimiter.reset(rateLimitId);

		// Invalidate all sessions
		await supabaseAdmin.from("sessions").delete().eq("user_id", user.id);

		// Generate new token
		const token = await generateToken(user.id);

		// Create new session
		await supabaseAdmin.from("sessions").insert({
			user_id: user.id,
			token,
			expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
		});

		return NextResponse.json({
			success: true,
			token,
			message: "Password reset successfully",
		});
	} catch (error) {
		console.error("Reset password error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
