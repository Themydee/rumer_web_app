import { supabase } from "./client";
import { Profile, User } from "./database.types";
import { getToken } from "./auth";

interface ProfileResponse {
	success: boolean;
	error?: string;
	profile?: Profile;
	user?: User;
}

// Get auth headers
function getAuthHeaders() {
	const token = getToken();
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};
}

// Get current user's profile
export async function getCurrentProfile(): Promise<ProfileResponse> {
	try {
		const response = await fetch("/api/auth/me", {
			headers: getAuthHeaders(),
		});

		if (!response.ok) {
			return { success: false, error: "Not authenticated" };
		}

		const data = await response.json();
		return {
			success: true,
			profile: data.user.profile,
			user: data.user,
		};
	} catch (error) {
		return { success: false, error: "Failed to get profile" };
	}
}

// Get profile by user ID
export async function getProfile(userId: string): Promise<ProfileResponse> {
	try {
		const { data: profile, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", userId)
			.single();

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, profile };
	} catch (error) {
		return { success: false, error: "Failed to get profile" };
	}
}

// Update profile (persisted via the authenticated update-profile API).
// The userId is accepted for API compatibility; the authenticated token
// identifies the user server-side.
export async function updateProfile(
	userId: string,
	updates: Partial<Profile>
): Promise<ProfileResponse> {
	try {
		const response = await fetch("/api/auth/update-profile", {
			method: "POST",
			headers: getAuthHeaders(),
			body: JSON.stringify(updates),
		});

		const data = await response.json();

		if (!response.ok) {
			return { success: false, error: data.error || "Failed to update profile" };
		}

		return { success: true, profile: data.profile };
	} catch (error) {
		return { success: false, error: "Failed to update profile" };
	}
}

// Update account setup (Step 2/3)
export async function updateAccountSetup(
	userId: string,
	data: {
		business_type?: "individual" | "business" | "trader";
		farm_name?: string;
		farm_location?: string;
		livestock_types?: string[];
		date_of_birth?: string;
	}
): Promise<ProfileResponse> {
	return updateProfile(userId, data);
}

// Update personal details (Step 3/3)
export async function updatePersonalDetails(
	userId: string,
	data: {
		id_type?: "nin" | "passport" | "nimc";
		id_number?: string;
	}
): Promise<ProfileResponse> {
	return updateProfile(userId, data);
}

// Upload avatar
export async function uploadAvatar(
	userId: string,
	file: File
): Promise<ProfileResponse> {
	try {
		const fileExt = file.name.split(".").pop();
		const fileName = `${userId}/avatar.${fileExt}`;
		const filePath = `avatars/${fileName}`;

		// Upload file to storage
		const { error: uploadError } = await supabase.storage
			.from("avatars")
			.upload(filePath, file, { upsert: true });

		if (uploadError) {
			return { success: false, error: uploadError.message };
		}

		// Get public URL
		const { data: urlData } = supabase.storage
			.from("avatars")
			.getPublicUrl(filePath);

		// Update profile with avatar URL
		return updateProfile(userId, { avatar_url: urlData.publicUrl });
	} catch (error) {
		return { success: false, error: "Failed to upload avatar" };
	}
}

// Delete profile
export async function deleteProfile(userId: string): Promise<ProfileResponse> {
	try {
		const { error } = await supabase.from("profiles").delete().eq("id", userId);

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		return { success: false, error: "Failed to delete profile" };
	}
}

// Search profiles (admin function)
export async function searchProfiles(
	query: string
): Promise<ProfileResponse[]> {
	try {
		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
			.limit(10);

		if (error) {
			return [];
		}

		return data.map((profile) => ({ success: true, profile }));
	} catch (error) {
		return [];
	}
}
