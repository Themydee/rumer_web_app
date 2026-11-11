import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";
import webPush from "web-push";

// Configure web-push with VAPID keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_EMAIL = process.env.VAPID_EMAIL || "mailto:noreply@rumer.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

async function sendPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: { title: string; body: string; tag?: string; url?: string }
): Promise<boolean> {
  try {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    };

    await webPush.sendNotification(pushSubscription, JSON.stringify(payload));
    return true;
  } catch (error: unknown) {
    // If subscription is invalid (404 or 410), delete it
    if (
      error &&
      typeof error === "object" &&
      "statusCode" in error &&
      (error.statusCode === 404 || error.statusCode === 410)
    ) {
      await supabaseAdmin
        .from("push_subscriptions")
        .delete()
        .eq("endpoint", subscription.endpoint);
    }
    return false;
  }
}

async function sendPushToUser(userId: string, notification: {
  title: string;
  message: string;
  link?: string;
}) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return;

  // Check user's push preference
  const { data: settings } = await supabaseAdmin
    .from("notification_settings")
    .select("push")
    .eq("user_id", userId)
    .single();

  if (settings && settings.push === false) return;

  // Get user's push subscriptions
  const { data: subscriptions } = await supabaseAdmin
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", userId);

  if (!subscriptions || subscriptions.length === 0) return;

  const payload = {
    title: notification.title,
    body: notification.message,
    tag: "rumer-notification",
    url: notification.link || "/notifications",
  };

  await Promise.allSettled(
    subscriptions.map((sub) => sendPushNotification(sub, payload))
  );
}

export async function GET(request: Request) {
	try {
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
		}

		const payload = await verifyToken(token);
		if (!payload) {
			return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
		}

		const { data, error } = await supabaseAdmin
			.from("notifications")
			.select("*")
			.eq("user_id", payload.userId)
			.order("created_at", { ascending: false })
			.limit(100);

		if (error) {
			console.error("List notifications error:", error);
			return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
		}

		return NextResponse.json({ success: true, notifications: data });
	} catch (error) {
		console.error("List notifications error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
		}

		const payload = await verifyToken(token);
		if (!payload) {
			return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
		}

		const body = await request.json();
		const { title, message, type, link, image } = body;

		if (!title || !message) {
			return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
		}

		// SEC-09: Sanitize inputs — strip HTML tags to prevent stored XSS
		const sanitize = (s: string | undefined): string | null =>
			s ? s.replace(/<[^>]*>/g, "").trim().slice(0, 500) : null;

		const safeTitle = sanitize(title);
		const safeMessage = sanitize(message);
		const safeLink = link ? String(link).trim().slice(0, 2000) : null;
		const safeImage = image ? String(image).trim().slice(0, 2000) : null;

		if (!safeTitle || !safeMessage) {
			return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
		}

		// Avoid duplicate bursts: skip if an identical notification was created very recently.
		const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
		const { data: existing, error: dedupeError } = await supabaseAdmin
			.from("notifications")
			.select("id")
			.eq("user_id", payload.userId)
			.eq("title", safeTitle)
			.eq("message", safeMessage)
			.gte("created_at", fiveSecondsAgo)
			.limit(1);

		if (dedupeError) {
			console.error("Notification dedupe check error:", dedupeError);
		} else if (existing && existing.length > 0) {
			return NextResponse.json({ success: true, notification: existing[0], duplicate: true });
		}

		const { data, error } = await supabaseAdmin
			.from("notifications")
			.insert({
				user_id: payload.userId,
				title: safeTitle,
				message: safeMessage,
				type: type || "info",
				link: safeLink,
				image: safeImage,
			})
			.select("*")
			.single();

		if (error) {
			console.error("Create notification error:", error);
			return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
		}

		// Send push notification asynchronously (don't block the response)
		sendPushToUser(payload.userId, {
			title: safeTitle,
			message: safeMessage,
			link: safeLink || undefined,
		}).catch((err) => {
			console.error("Push notification error:", err);
		});

		return NextResponse.json({ success: true, notification: data });
	} catch (error) {
		console.error("Create notification error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}