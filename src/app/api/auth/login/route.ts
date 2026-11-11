import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { comparePassword, generateToken, resolveUserByIdentifier } from "@/components/lib/auth-helpers";
import { authLimiter, getRateLimitId } from "@/components/lib/rate-limit";
import type { User, Profile } from "@/components/lib/supabase/database.types";

export async function POST(request: Request) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			);
		}

		// SEC-11: Rate limit login attempts
		const rateLimitId = getRateLimitId(request, email.toLowerCase());
		const { success: allowed } = authLimiter.check(rateLimitId);
		if (!allowed) {
			return NextResponse.json(
				{ error: "Too many login attempts. Please try again later." },
				{ status: 429 }
			);
		}

		// Get user
		const user = await resolveUserByIdentifier(email);

		if (!user) {
			return NextResponse.json(
				{ error: "Invalid email or password" },
				{ status: 401 }
			);
		}

		// Verify password
		const isValid = await comparePassword(password, user.password_hash);
		if (!isValid) {
			return NextResponse.json(
				{ error: "Invalid email or password" },
				{ status: 401 }
			);
		}

		// SEC-11: Reset rate limiter on successful login
		authLimiter.reset(rateLimitId);

		// Generate token
		const token = await generateToken(user.id);

		// Create session
		await supabaseAdmin.from("sessions").insert({
			user_id: user.id,
			token,
			expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
		});

		// Get profile
		const { data: profile, error: profileError } = await supabaseAdmin
			.from("profiles")
			.select("*")
			.eq("id", user.id)
			.single();

		return NextResponse.json({
			success: true,
			token,
			user: {
				id: user.id,
				email: user.email,
				isEmailVerified: user.is_email_verified,
				profile: profile as Profile | null,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
