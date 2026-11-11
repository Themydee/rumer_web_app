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
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!isValidUrl(rawUrl) || !rawKey) {
	console.warn(
		"Supabase URL or Anon Key is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
	);
}

// Use a placeholder URL when env vars are invalid so the client can be created
// at build time without throwing. Calls will fail until real credentials are set.
const supabaseUrl = isValidUrl(rawUrl)
	? rawUrl
	: "https://placeholder.supabase.co";
const supabaseAnonKey = rawKey || "placeholder-anon-key";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true,
	},
});
