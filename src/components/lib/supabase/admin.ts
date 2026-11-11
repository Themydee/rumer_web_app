import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

function isValidUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseUrl = isValidUrl(rawUrl)
	? rawUrl
	: "https://placeholder.supabase.co";
const serviceRoleKey = rawKey || "placeholder-service-role";

// Service-role client bypasses RLS. Keep the key server-only.
export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});
