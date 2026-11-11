import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import webPush from "web-push";

// Configure web-push with VAPID keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_EMAIL = process.env.VAPID_EMAIL || "mailto:noreply@rumer.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  url?: string;
  data?: Record<string, unknown>;
}

async function sendPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: PushNotificationPayload
): Promise<boolean> {
  try {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    };

    await webPush.sendNotification(
      pushSubscription,
      JSON.stringify(payload)
    );

    return true;
  } catch (error: unknown) {
    // If subscription is invalid (404 or 410), delete it
    if (
      error &&
      typeof error === "object" &&
      "statusCode" in error &&
      (error.statusCode === 404 || error.statusCode === 410)
    ) {
      console.log("Invalid subscription, deleting:", subscription.endpoint);
      await supabaseAdmin
        .from("push_subscriptions")
        .delete()
        .eq("endpoint", subscription.endpoint);
    }
    return false;
  }
}

export async function POST(request: Request) {
  try {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Push notifications not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { userId, notification } = body;

    if (!userId || !notification?.title || !notification?.body) {
      return NextResponse.json(
        { error: "User ID and notification are required" },
        { status: 400 }
      );
    }

    // Get user's push subscriptions
    const { data: subscriptions, error } = await supabaseAdmin
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", userId);

    if (error) {
      console.error("Fetch subscriptions error:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions" },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: "No push subscriptions found" });
    }

    // Check user's notification preferences
    const { data: settings } = await supabaseAdmin
      .from("notification_settings")
      .select("push")
      .eq("user_id", userId)
      .single();

    // Default to true if no settings found
    if (settings && settings.push === false) {
      return NextResponse.json({ success: true, message: "Push notifications disabled" });
    }

    const payload: PushNotificationPayload = {
      title: notification.title,
      body: notification.body,
      icon: notification.icon || "/icons/notification-icon.png",
      badge: notification.badge || "/icons/badge-icon.png",
      image: notification.image,
      tag: notification.tag || "rumer-notification",
      url: notification.url || "/notifications",
      data: notification.data,
    };

    // Send to all user's subscriptions
    const results = await Promise.allSettled(
      subscriptions.map((sub) => sendPushNotification(sub, payload))
    );

    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value === true
    ).length;

    const failed = results.filter(
      (r) => r.status === "rejected" || (r.status === "fulfilled" && r.value === false)
    ).length;

    return NextResponse.json({
      success: true,
      message: `Push notifications sent: ${successful} successful, ${failed} failed`,
    });
  } catch (error) {
    console.error("Send push notification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
