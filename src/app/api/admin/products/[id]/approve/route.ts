import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";
import { createServerNotification } from "@/components/lib/serverNotifications";

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json({ error: "Authorization required" }, { status: 401 });
		}

		const payload = await verifyToken(token);
		if (!payload) {
			return NextResponse.json({ error: "Invalid token" }, { status: 401 });
		}

		// Check if user is admin
		const { data: profile } = await supabaseAdmin
			.from("profiles")
			.select("is_admin")
			.eq("id", payload.userId)
			.single();

		if (!profile?.is_admin) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		const { id } = await params;
		const body = await request.json();
		const { status } = body;

		if (!status || !["published", "draft"].includes(status)) {
			return NextResponse.json(
				{ error: "Invalid status. Must be 'published' or 'draft'" },
				{ status: 400 }
			);
		}

		// Fetch the product first to know its owner (for notifications) and
		// to detect whether the status actually changed.
		const { data: product } = await supabaseAdmin
			.from("products")
			.select("id, owner_id, product_name, status")
			.eq("id", id)
			.single();

		if (!product) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		const oldStatus = product.status;

		const { data, error } = await supabaseAdmin
			.from("products")
			.update({
				status,
				updated_at: new Date().toISOString(),
			})
			.eq("id", id)
			.select("*")
			.single();

		if (error) {
			console.error("Approve product error:", error);
			return NextResponse.json(
				{ error: "Failed to update product" },
				{ status: 500 }
			);
		}

		if (!data) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		// Only notify when the status meaningfully changed.
		if (oldStatus !== status && product.owner_id) {
			const productName = product.product_name || "Your product";
			if (status === "published") {
				await createServerNotification({
					userId: product.owner_id,
					title: "Product approved",
					message: `"${productName}" has been approved and can now be published on the marketplace.`,
					type: "success",
					link: "/dashboard/products/published",
				});
				await createServerNotification({
					userId: product.owner_id,
					title: "Product published",
					message: `"${productName}" is now live on the marketplace.`,
					type: "success",
					link: "/dashboard/products/published",
				});
			} else if (status === "draft") {
				await createServerNotification({
					userId: product.owner_id,
					title: "Product rejected",
					message: `"${productName}" was not approved. Please review and resubmit it.`,
					type: "error",
					link: "/dashboard/products/drafts",
				});
			}
		}

		return NextResponse.json({ success: true, product: data });
	} catch (error) {
		console.error("Approve product error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
