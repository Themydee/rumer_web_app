import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import type { User } from "@/components/lib/supabase/database.types";
import crypto from "crypto";

// SEC-01: Fail fast if JWT_SECRET is not configured — no fallback
const JWT_SECRET_ENV = process.env.JWT_SECRET;
if (!JWT_SECRET_ENV) {
	throw new Error("JWT_SECRET environment variable is required");
}
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_ENV);

const TOKEN_EXPIRY = "7d";

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 12);
}

export async function comparePassword(
	password: string,
	hash: string
): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

export async function generateToken(userId: string): Promise<string> {
	return new SignJWT({ userId })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(TOKEN_EXPIRY)
		.sign(JWT_SECRET);
}

export async function verifyToken(
	token: string
): Promise<{ userId: string } | null> {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		return { userId: payload.userId as string };
	} catch {
		return null;
	}
}

// SEC-02: Use crypto.getRandomValues() for cryptographically secure OTP
export function generateOTP(): string {
	const buffer = crypto.getRandomValues(new Uint8Array(4));
	const num = buffer[0] * 0x1000000 + buffer[1] * 0x10000 + buffer[2] * 0x100 + buffer[3];
	return (num % 900000 + 100000).toString();
}

// Phone logins/resets are sent as `+234{phone}@phone.rumer.local`. Resolve the
// real user by matching the phone stored on the profile (supports +234 / 0 /
// national number formats by comparing the last 10 digits).
export const PHONE_SUFFIX = "@phone.rumer.local";

// SEC-10: Strict Nigerian phone validation — must be 10 digits after normalization
// Nigerian numbers: 0XXXXXXXXXX (11 digits) or +234XXXXXXXXXX (13 digits)
export function normalizePhone(phone: string): string | null {
	const digits = phone.replace(/\D/g, "");

	// Must be 10 digits (national format without prefix)
	if (digits.length === 10 && /^[789]\d{9}$/.test(digits)) {
		return digits;
	}

	// Must be 11 digits starting with 0 (Nigerian national format)
	if (digits.length === 11 && digits.startsWith("0")) {
		const national = digits.slice(1);
		if (/^[789]\d{9}$/.test(national)) return national;
	}

	// Must be 13 digits starting with 234 (international format)
	if (digits.length === 13 && digits.startsWith("234")) {
		const national = digits.slice(3);
		if (/^[789]\d{9}$/.test(national)) return national;
	}

	return null; // Invalid Nigerian phone number
}

export function phoneCandidates(phone: string): string[] {
	const national = normalizePhone(phone);
	if (!national) return [];
	return [`+234${national}`, `0${national}`, national];
}

export async function resolveUserByIdentifier(identifier: string): Promise<User | null> {
	if (identifier.endsWith(PHONE_SUFFIX)) {
		const rawPhone = identifier.replace(PHONE_SUFFIX, "");
		const candidates = phoneCandidates(rawPhone);
		if (candidates.length) {
			const { data: profiles } = await supabaseAdmin
				.from("profiles")
				.select("id, phone")
				.in("phone", candidates)
				.limit(1);
			if (profiles && profiles.length > 0) {
				const { data: matchedUser } = await supabaseAdmin
					.from("users")
					.select("*")
					.eq("id", profiles[0].id)
					.single();
				return matchedUser;
			}
		}
		return null;
	}

	const { data: matchedUser } = await supabaseAdmin
		.from("users")
		.select("*")
		.eq("email", identifier.toLowerCase())
		.single();
	return matchedUser;
}
