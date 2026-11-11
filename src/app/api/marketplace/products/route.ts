import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status") || "published";
		const productType = searchParams.get("productType");
		const livestockType = searchParams.get("livestockType");
		const search = searchParams.get("search");
		const state = searchParams.get("state");

		// Fetch products without join first
		let query = supabaseAdmin
			.from("products")
			.select("*")
			.eq("status", status as "draft" | "pending" | "published" | "sold")
			.order("created_at", { ascending: false });

		if (productType) {
			query = query.eq("product_type", productType as "livestock" | "processed");
		}

		if (livestockType) {
			query = query.ilike("livestock_type", livestockType);
		}

		if (search) {
			query = query.or(
				`product_name.ilike.%${search}%,description.ilike.%${search}%,livestock_type.ilike.%${search}%`
			);
		}

		const { data: products, error } = await query;

		if (error) {
			console.error("Marketplace products query error:", JSON.stringify(error, null, 2));

			if (error.code === "42P01" || error.message?.includes("does not exist")) {
				return NextResponse.json(
					{
						error: "Products table not found. Please run the migration SQL in your Supabase dashboard.",
						tableMissing: true,
					},
					{ status: 500 }
				);
			}

			return NextResponse.json(
				{ error: "Failed to fetch marketplace products" },
				{ status: 500 }
			);
		}

		if (!products || products.length === 0) {
			return NextResponse.json({ success: true, products: [] });
		}

		// Fetch owner profiles separately
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
		console.error("Marketplace products error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
