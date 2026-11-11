import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";
import { createServerNotification } from "@/components/lib/serverNotifications";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
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
			.from("products")
			.select("*")
			.eq("id", id)
			.eq("owner_id", payload.userId)
			.single();

		if (error || !data) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, product: data });
	} catch (error) {
		console.error("Get product error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
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
		const {
			productType,
			listingType,
			productName,
			livestockType,
			cutType,
			unitSize,
			unitMeasure,
			storageType,
			hsCode,
			basePrice,
			description,
			status,
			images,
		} = body;

		if (!productName || !productName.trim()) {
			return NextResponse.json({ error: "Product name is required" }, { status: 400 });
		}

		if (!basePrice || parseFloat(basePrice) <= 0) {
			return NextResponse.json({ error: "Base price is required and must be greater than 0" }, { status: 400 });
		}

		const updates: Record<string, unknown> = {
			product_name: productName.trim(),
			base_price: parseFloat(basePrice),
			updated_at: new Date().toISOString(),
		};

		if (productType !== undefined) updates.product_type = productType;
		if (listingType !== undefined) updates.listing_type = listingType || null;
		if (livestockType !== undefined) updates.livestock_type = livestockType || null;
		if (cutType !== undefined) updates.cut_type = cutType || null;
		if (unitSize !== undefined) updates.unit_size = unitSize ? parseFloat(unitSize) : null;
		if (unitMeasure !== undefined) updates.unit_measure = unitMeasure || null;
		if (storageType !== undefined) updates.storage_type = storageType || null;
		if (hsCode !== undefined) updates.hs_code = hsCode || null;
		if (description !== undefined) updates.description = description || null;
		if (status !== undefined && ["draft", "pending", "published", "sold"].includes(status)) {
			updates.status = status;
		}
		if (images !== undefined) updates.images = images;

		const { data, error } = await supabaseAdmin
			.from("products")
			.update(updates as never)
			.eq("id", id)
			.eq("owner_id", payload.userId)
			.select("*")
			.single();

		if (error) {
			console.error("Update product error:", error);
			return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
		}

		if (!data) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, product: data });
	} catch (error) {
		console.error("Update product error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
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
		const { status } = body;

		if (!status || !["draft", "pending", "published", "sold"].includes(status)) {
			return NextResponse.json({ error: "Invalid status" }, { status: 400 });
		}

		if (status === "published" || status === "pending") {
			const { data: ownerProfile } = await supabaseAdmin
				.from("profiles")
				.select("kyc_tier, is_verified")
				.eq("id", payload.userId)
				.single();

			const tier = ownerProfile?.kyc_tier ?? (ownerProfile?.is_verified ? "tier_1" : "tier_0");
			if (tier === "tier_0") {
				return NextResponse.json(
					{
						error: "Tier 1 KYC verification (BVN + Valid ID + Liveness Check) is required to list and publish animals on the marketplace. You can keep this record in draft/inventory mode.",
						requiresKycUpgrade: true,
						currentTier: "tier_0",
						requiredTier: "tier_1",
					},
					{ status: 403 }
				);
			}
		}

		// Capture prior status so we can notify on the transition to sold/published.
		const { data: existing } = await supabaseAdmin
			.from("products")
			.select("status, product_name")
			.eq("id", id)
			.eq("owner_id", payload.userId)
			.single();

		const { data, error } = await supabaseAdmin
			.from("products")
			.update({ status, updated_at: new Date().toISOString() })
			.eq("id", id)
			.eq("owner_id", payload.userId)
			.select("*")
			.single();

		if (error) {
			console.error("Update product error:", error);
			return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
		}

		if (!data) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		// Notify the seller on status transitions.
		if (existing?.status !== status) {
			const productName = data.product_name || existing?.product_name || "Your product";
			if (status === "published") {
				await createServerNotification({
					userId: payload.userId,
					title: "Product published",
					message: `"${productName}" is now live on the marketplace.`,
					type: "success",
					link: "/dashboard/products/published",
				});
			} else if (status === "sold") {
				await createServerNotification({
					userId: payload.userId,
					title: "Product sold",
					message: `"${productName}" has been sold.`,
					type: "success",
					link: "/dashboard/products/sold",
				});
			}
		}

		return NextResponse.json({ success: true, product: data });
	} catch (error) {
		console.error("Update product error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
		}

		const payload = await verifyToken(token);
		if (!payload) {
			return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
		}

		const { error } = await supabaseAdmin
			.from("products")
			.delete()
			.eq("id", id)
			.eq("owner_id", payload.userId);

		if (error) {
			console.error("Delete product error:", error);
			return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Delete product error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
