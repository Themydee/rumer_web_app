import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { sendNotificationEmail } from "@/components/lib/email";

export type ServerNotificationType = "info" | "success" | "warning" | "error";

interface CreateNotificationInput {
	userId: string;
	title: string;
	message: string;
	type?: ServerNotificationType;
	link?: string | null;
	image?: string | null;
}

/**
 * Create a notification row for a user and, if email notifications are
 * enabled for that user, send them a transactional email. Used server-side
 * (API routes) at the exact moment a business event occurs so the
 * notification is durably stored and delivered regardless of whether
 * Realtime is configured.
 */
export async function createServerNotification({
	userId,
	title,
	message,
	type = "info",
	link = null,
	image = null,
}: CreateNotificationInput): Promise<boolean> {
	if (!userId) return false;

	// Sanitize to prevent stored XSS (matches SEC-09 in the POST route).
	const sanitize = (s: string | null | undefined): string | null =>
		s ? s.replace(/<[^>]*>/g, "").trim().slice(0, 500) : null;

	const safeTitle = sanitize(title);
	const safeMessage = sanitize(message);

	if (!safeTitle || !safeMessage) return false;

	// Avoid duplicates bursts for the same event.
	const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
	const { data: existing } = await supabaseAdmin
		.from("notifications")
		.select("id")
		.eq("user_id", userId)
		.eq("title", safeTitle)
		.eq("message", safeMessage)
		.gte("created_at", fiveSecondsAgo)
		.limit(1);

	if (existing && existing.length > 0) return true;

	const { error } = await supabaseAdmin.from("notifications").insert({
		user_id: userId,
		title: safeTitle,
		message: safeMessage,
		type: ["info", "success", "warning", "error"].includes(type) ? type : "info",
		link: link ? String(link).trim().slice(0, 2000) : null,
		image: image ? String(image).trim().slice(0, 2000) : null,
	});

	if (error) {
		console.error("Create server notification error:", error);
		return false;
	}

	// Best-effort email delivery. Never block the API on email failure.
	await sendNotificationIfEnabled({
		userId,
		title: safeTitle,
		message: safeMessage,
		type,
		link: link ? String(link).trim().slice(0, 2000) : null,
	}).catch((e) => {
		console.error("Send notification email error:", e);
	});

	return true;
}

async function sendNotificationIfEnabled({
	userId,
	title,
	message,
	type,
	link,
}: {
	userId: string;
	title: string;
	message: string;
	type: string;
	link: string | null;
}) {
	// Look up the recipient, defaulting to email ON when no preference row exists.
	const [recipient, profile, settings] = await Promise.all([
		supabaseAdmin
			.from("users")
			.select("email")
			.eq("id", userId)
			.single(),
		supabaseAdmin
			.from("profiles")
			.select("first_name")
			.eq("id", userId)
			.single(),
		supabaseAdmin
			.from("notification_settings")
			.select("email")
			.eq("user_id", userId)
			.single(),
	]);

	const email = recipient.data?.email;
	if (!email) return;

	// Respect an explicit opt-out; otherwise send by default.
	const emailEnabled = settings.data ? Boolean(settings.data.email) : true;
	if (!emailEnabled) return;

	const name = profile.data?.first_name || "there";

	await sendNotificationEmail({
		name,
		email,
		title,
		message,
		type,
		link,
	});
}