import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";

export async function GET(request: Request) {
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

		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status") || "pending";

		const { data: products, error } = await supabaseAdmin
			.from("products")
			.select("*")
			.eq("status", status as "draft" | "pending" | "published" | "sold")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Admin products query error:", JSON.stringify(error, null, 2));
			return NextResponse.json(
				{ error: "Failed to fetch products" },
				{ status: 500 }
			);
		}

		if (!products || products.length === 0) {
			return NextResponse.json({ success: true, products: [] });
		}

		const ownerIds = Array.from(new Set(products.map((p) => p.owner_id)));
		const { data: profiles } = await supabaseAdmin
			.from("profiles")
			.select("id, first_name, last_name, farm_name")
			.in("id", ownerIds);

		const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

		const productsWithOwners = products.map((p) => ({
			...p,
			profiles: profileMap.get(p.owner_id) || null,
		}));

		return NextResponse.json({ success: true, products: productsWithOwners });
	} catch (error) {
		console.error("Admin products error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
