import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { hashPassword, generateToken, generateOTP } from "@/components/lib/auth-helpers";
import { sendOtpEmail } from "@/components/lib/email/send-email";
import { authLimiter, getRateLimitId } from "@/components/lib/rate-limit";

export async function POST(request: Request) {
	try {
		const { firstName, lastName, email, phone, password } = await request.json();

		// Validate required fields
		if (!firstName || !lastName || !email || !password) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// SEC-11: Rate limit signup attempts
		const rateLimitId = getRateLimitId(request, email.toLowerCase());
		const { success: allowed } = authLimiter.check(rateLimitId);
		if (!allowed) {
			return NextResponse.json(
				{ error: "Too many signup attempts. Please try again later." },
				{ status: 429 }
			);
		}

		// Check if user already exists
		const { data: existingUser } = await supabaseAdmin
			.from("users")
			.select("id")
			.eq("email", email.toLowerCase())
			.single();

		if (existingUser) {
			return NextResponse.json(
				{ error: "Email already registered" },
				{ status: 409 }
			);
		}

		// Hash password
		const passwordHash = await hashPassword(password);

		// Create user
		const { data: user, error: userError } = await supabaseAdmin
			.from("users")
			.insert({
				email: email.toLowerCase(),
				password_hash: passwordHash,
			})
			.select("id")
			.single();

		if (userError) {
			console.error("User creation error:", userError);
			return NextResponse.json(
				{ error: "Failed to create account" },
				{ status: 500 }
			);
		}

		// Create profile
		const { error: profileError } = await supabaseAdmin.from("profiles").insert({
			id: user.id,
			first_name: firstName,
			last_name: lastName,
			phone: phone || "",
		});

		if (profileError) {
			console.error("Profile creation error:", profileError);
			// Continue anyway - profile can be completed later
		}

		// Generate email verification OTP
		const emailOTP = generateOTP();
		const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

		await supabaseAdmin.from("otp_codes").insert({
			user_id: user.id,
			code: emailOTP,
			type: "email",
			expires_at: expiresAt.toISOString(),
		});

		// Send verification email
		await sendOtpEmail({ name: firstName, email, otp: emailOTP });

		// Generate session token
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
			userId: user.id,
			message: "Account created. Please verify your email.",
		});
	} catch (error) {
		console.error("Signup error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
