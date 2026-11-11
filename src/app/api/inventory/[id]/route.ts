import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";
import { createServerNotification } from "@/components/lib/serverNotifications";

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
		const { weight, quantity, status, state, lga, town, imageUrl } = body;

		const updates: Record<string, unknown> = {
			updated_at: new Date().toISOString(),
		};

		if (weight !== undefined) updates.weight = weight ? parseFloat(weight) : null;
		if (quantity !== undefined) updates.quantity = parseInt(quantity);
		if (status !== undefined) {
			if (!["available", "reserved", "sold", "archived"].includes(status)) {
				return NextResponse.json({ error: "Invalid status" }, { status: 400 });
			}
			updates.status = status;
		}
		if (state !== undefined) updates.state = state || null;
		if (lga !== undefined) updates.lga = lga || null;
		if (town !== undefined) updates.town = town || null;
		if (imageUrl !== undefined) updates.image_url = imageUrl || null;

		// Capture prior status so we can notify on the transition to sold.
		const { data: existing } = await supabaseAdmin
			.from("inventory")
			.select("status, serial_number")
			.eq("id", id)
			.eq("owner_id", payload.userId)
			.single();

		const { data, error } = await supabaseAdmin
			.from("inventory")
			.update(updates as never)
			.eq("id", id)
			.eq("owner_id", payload.userId)
			.select("*")
			.single();

		if (error) {
			console.error("Update inventory error:", error);
			return NextResponse.json({ error: "Failed to update inventory item" }, { status: 500 });
		}

		if (!data) {
			return NextResponse.json({ error: "Inventory item not found" }, { status: 404 });
		}

		// Notify the seller when their inventory item is sold.
		if (data.status === "sold" && existing?.status !== "sold") {
			const serial = data.serial_number || existing?.serial_number || "Your item";
			await createServerNotification({
				userId: payload.userId,
				title: "Product sold",
				message: `${serial} has been sold.`,
				type: "success",
				link: "/dashboard/products/sold",
			});
		}

		return NextResponse.json({ success: true, item: data });
	} catch (error) {
		console.error("Update inventory error:", error);
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
			.from("inventory")
			.delete()
			.eq("id", id)
			.eq("owner_id", payload.userId);

		if (error) {
			console.error("Delete inventory error:", error);
			return NextResponse.json({ error: "Failed to delete inventory item" }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Delete inventory error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
