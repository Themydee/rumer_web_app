import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";

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
    const { endpoint, keys } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: "Invalid push subscription" }, { status: 400 });
    }

    // Check if subscription already exists
    const { data: existing } = await supabaseAdmin
      .from("push_subscriptions")
      .select("id")
      .eq("user_id", payload.userId)
      .eq("endpoint", endpoint)
      .limit(1);

    if (existing && existing.length > 0) {
      // Update existing subscription
      const { error } = await supabaseAdmin
        .from("push_subscriptions")
        .update({
          p256dh: keys.p256dh,
          auth: keys.auth,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing[0].id);

      if (error) {
        console.error("Update push subscription error:", error);
        return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Subscription updated" });
    }

    // Create new subscription
    const { error } = await supabaseAdmin.from("push_subscriptions").insert({
      user_id: payload.userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    });

    if (error) {
      console.error("Create push subscription error:", error);
      return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Subscription created" });
  } catch (error) {
    console.error("Push subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get("endpoint");

    let query = supabaseAdmin
      .from("push_subscriptions")
      .delete()
      .eq("user_id", payload.userId);

    if (endpoint) {
      query = query.eq("endpoint", endpoint);
    }

    const { error } = await query;

    if (error) {
      console.error("Delete push subscription error:", error);
      return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Subscription deleted" });
  } catch (error) {
    console.error("Delete push subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
