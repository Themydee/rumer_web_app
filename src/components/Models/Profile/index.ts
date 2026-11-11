interface ProfileModel {
	id: number;
	email: string;
	email_verified_at: string;
	created_at: string;
	updated_at: string;
	first_name: string;
	last_name: string;
	failed_login_attempts: number | null;
	locked_due_to_failed_login_attempts_at: string | null;
	role_id: number;
}
