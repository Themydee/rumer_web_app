interface UserType {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	username: string;
	phone_number: string;
	marital_status: "single" | "married" | "divorced" | "widowed";
	employment_status: "employed" | "unemployed" | "self-employed" | "student";
	address: string;
	gender: "MALE" | "FEMALE" | "OTHER";
	date_of_birth: string;
	state: string | null;
	city: string | null;
	region: string | null;
	loc: string | null;
	age: number | null;
	email_verified_at: string | null;
	phone_number_verified_at: string | null;
	profile_picture: string | null;
	bvn_is_verified: boolean | null;
	nin_is_verified: boolean | null;
	passed_liveness_check: boolean | null;
	next_eligibility_check_at: string | null;
	has_added_account: boolean | null;
	kyc_tier?: "tier_0" | "tier_1" | "tier_2" | "tier_3";
	kyc_status?: "unverified" | "pending" | "verified" | "rejected";
	cooperative_id?: string | null;
	is_sole_proprietor?: boolean;
	kyc_rejection_reason?: string | null;
	business_type?: "individual" | "business" | "trader" | null;
	is_admin?: boolean;
}

interface NextOfKinType {
	id: number;
	user_id: number;
	full_name: string;
	relationship: string;
	phone_number: string;
	email: string;
	created_at: string;
	updated_at: string;
}

interface BannerType {
	id: number;
	name: string;
	link: string;
	banner_image: string | null;
	created_at: string;
	updated_at: string;
}

interface ProfileEligibilityType {
	id: number;
	user_id: number;
	occupation: string | null;
	employment_period: string | null;
	property_location: string | null;
	salary_bank_name: string | null;
	salary_bank_code: string | null;
	salary_account_number: number | null;
	salary_account_name: string | null;
	salary_recipient_code: string | null;
	phone_number: string | null;
	passed_eligibility_check: boolean | null;
	eligibility_amount: number | null;
	data: string | null;
	type: string | null;
	salary_amount: number | null;
	company_name: string | null;
	company_location_state: string | null;
	company_branch_address: string | null;
	company_sector: string | null;
	work_email: string | null;
	work_email_verified_at: string | null;
	employer_email: string | null;
	created_at: string | null;
	updated_at: string | null;
}

interface ProfileType {
	id: number;
	phone_number: string;
	email: string;
	name: string;
	username: string;
	profile_image: string | null;
	created_at: string;
	updated_at: string;
}

interface LoginResponseType {
	message: string;
	data: {
		user: UserType;
		token: string;
	};
}

interface SoloDuoTrioFormValues {
	savingsName?: string;
	targetAmount?: string;
	savingsPreference?: string;
	startDate?: string;
	withdrawalDay?: string;
	monthDayToSave?: string;
	weeklyDayToSave?: string;
	monthlyTimeToSave?: string;
	weeklyTimeToSave?: string;
	amountToSaveMonthly?: string;
	amountToSaveWeekly?: string;
}

interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	marital_status: string;
	employment_status: string;
	address: string;
	gender: "MALE" | "FEMALE";
	date_of_birth: string;
	state: string | null;
	city: string | null;
	region: string | null;
	loc: string | null;
	age: number | null;
	email_verified_at: string | null;
	phone_number_verified_at: string | null;
	profile_image: string | null;
	bvn_is_verified: boolean | null;
	nin_is_verified: boolean | null;
	passed_liveness_check: boolean | null;
	next_eligibility_check_at: string | null;
	has_added_account: boolean | null;
}
interface Role {
	id: number;
	title: string;
	created_at: string;
	updated_at: string;
}

interface UserModel {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	role: Role;
	created_at: string;
	updated_at: string;
	phone_number: string;
}
