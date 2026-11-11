import type { Profile, KycTier, KycStatus } from "@/components/lib/supabase/database.types";

export interface ApiUser {
	id: string;
	email: string;
	isEmailVerified?: boolean;
	is_email_verified?: boolean;
	profile?: Profile | null;
}

/**
 * Maps the API user shape ({ id, email, profile }) into the Redux `UserType`
 * expected by the auth slice. Only the display fields are meaningful here; the
 * rest are filled with safe defaults because the legacy UserType requires them.
 */
export function toUserType(apiUser: ApiUser) {
	const p = apiUser.profile;
	const resolvedKycTier: KycTier = p?.kyc_tier ?? (p?.is_verified ? "tier_1" : "tier_0");
	const resolvedKycStatus: KycStatus = p?.kyc_status ?? (p?.is_verified ? "verified" : "unverified");

	return {
		id: 0,
		first_name: p?.first_name ?? "",
		last_name: p?.last_name ?? "",
		email: apiUser.email,
		username: p?.farm_name ?? "",
		phone_number: p?.phone ?? "",
		marital_status: "single",
		employment_status: "unemployed",
		address: "",
		gender: "OTHER",
		date_of_birth: "",
		state: null,
		city: null,
		region: null,
		loc: null,
		age: null,
		email_verified_at: null,
		phone_number_verified_at: null,
		profile_picture: p?.avatar_url ?? null,
		business_type: p?.business_type ?? null,
		bvn_is_verified: p?.is_verified ?? false,
		nin_is_verified: p?.is_verified ?? false,
		passed_liveness_check: resolvedKycTier !== "tier_0",
		next_eligibility_check_at: null,
		has_added_account: false,
		is_admin: p?.is_admin ?? false,
		kyc_tier: resolvedKycTier,
		kyc_status: resolvedKycStatus,
		cooperative_id: p?.cooperative_id ?? null,
		is_sole_proprietor: p?.is_sole_proprietor ?? false,
		kyc_rejection_reason: p?.kyc_rejection_reason ?? null,
	} as any;
}

/**
 * Returns the effective KYC tier for a user.
 */
export function getKycTier(user: any): KycTier {
	if (!user) return "tier_0";
	if (user.kyc_tier) return user.kyc_tier;
	if (user.bvn_is_verified || user.nin_is_verified || user.is_verified) return "tier_1";
	return "tier_0";
}

/**
 * Tier 0 users can onboard livestock for tracking/EEWYLA training, but cannot list/publish for sale.
 * Tier 1, 2, and 3 users can list animals for sale on the marketplace.
 */
export function canListAnimals(user: any): boolean {
	const tier = getKycTier(user);
	return tier === "tier_1" || tier === "tier_2" || tier === "tier_3";
}

/**
 * Tier 0 cannot receive payments.
 * Tier 1 can receive payments only via cooperative wallet OR as a registered sole proprietor.
 * Tier 2 can receive aggregated order payments.
 * Tier 3 has unrestricted direct payments.
 */
export function canReceivePayments(user: any): boolean {
	const tier = getKycTier(user);
	if (tier === "tier_0") return false;
	if (tier === "tier_1") {
		return Boolean(user?.cooperative_id || user?.is_sole_proprietor);
	}
	return true;
}

/**
 * Returns whether user has full direct unrestricted payment rights (Tier 3 or verified sole proprietor).
 */
export function canReceiveDirectPayments(user: any): boolean {
	const tier = getKycTier(user);
	if (tier === "tier_3") return true;
	if (tier === "tier_1" && user?.is_sole_proprietor) return true;
	return false;
}

export function isTier2Cooperative(user: any): boolean {
	return getKycTier(user) === "tier_2";
}

export function isTier3Business(user: any): boolean {
	return getKycTier(user) === "tier_3";
}

