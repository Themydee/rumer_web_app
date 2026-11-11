import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";

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

		const userId = payload.userId;
		const { searchParams } = new URL(request.url);
		const productId = searchParams.get("productId");

		if (!productId) {
			return NextResponse.json({ error: "productId is required" }, { status: 400 });
		}

		const { data, error } = await supabaseAdmin
			.from("inventory")
			.select("*")
			.eq("owner_id", userId)
			.eq("product_id", productId)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("List inventory error:", error);
			return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
		}

		return NextResponse.json({ success: true, inventory: data });
	} catch (error) {
		console.error("List inventory error:", error);
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

		const userId = payload.userId;
		const body = await request.json();

		const { productId, weight, age, ageUnit, state, lga, town, imageUrl } = body;

		if (!productId) {
			return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
		}

		if (!weight || parseFloat(weight) <= 0) {
			return NextResponse.json({ error: "Weight is required" }, { status: 400 });
		}

		if (!age || parseInt(age) <= 0) {
			return NextResponse.json({ error: "Age is required" }, { status: 400 });
		}

		// SEC-13: Use crypto for cryptographically secure serial number
		const crypto = await import("crypto");
		const timestamp = Date.now().toString(36).toUpperCase();
		const random = crypto.randomBytes(3).toString("hex").toUpperCase();
		const serialNumber = `NG-TAG-${timestamp}-${random}`;

		const { data, error } = await supabaseAdmin
			.from("inventory")
			.insert({
				product_id: productId,
				owner_id: userId,
				serial_number: serialNumber,
				weight: parseFloat(weight),
				quantity: 1,
				status: "available",
				state: state || null,
				lga: lga || null,
				town: town || null,
				image_url: imageUrl || null,
			})
			.select("*")
			.single();

		if (error) {
			console.error("Create inventory error:", error);
			return NextResponse.json({ error: "Failed to create inventory" }, { status: 500 });
		}

		return NextResponse.json({ success: true, item: data });
	} catch (error) {
		console.error("Create inventory error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
