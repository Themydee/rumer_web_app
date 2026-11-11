import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";

export async function GET(request: Request) {
	try {
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json(
				{ error: "Authorization token required" },
				{ status: 401 }
			);
		}

		const payload = await verifyToken(token);
		if (!payload) {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		const userId = payload.userId;
		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status");

		let query = supabaseAdmin
			.from("products")
			.select("*")
			.eq("owner_id", userId)
			.order("created_at", { ascending: false });

		if (status) {
			query = query.eq("status", status as "draft" | "pending" | "published" | "sold");
		}

		const { data, error } = await query;

		if (error) {
			// Check if the table doesn't exist
			if (error.message?.includes("does not exist") || error.code === "42P01") {
				return NextResponse.json(
					{
						error: "Products table not found. Please run the migration SQL in your Supabase dashboard.",
						tableMissing: true,
					},
					{ status: 500 }
				);
			}
			console.error("List products error:", error);
			return NextResponse.json(
				{ error: "Failed to fetch products" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true, products: data });
	} catch (error) {
		console.error("List products error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json(
				{ error: "Authorization token required" },
				{ status: 401 }
			);
		}

		const payload = await verifyToken(token);
		if (!payload) {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		const userId = payload.userId;
		const body = await request.json();

		const {
			productType,
			listingType,
			productName,
			livestockType,
			cutType,
			age,
			unitSize,
			unitMeasure,
			storageType,
			hsCode,
			basePrice,
			description,
			images,
		} = body;

		// Validate required fields
		if (!productType) {
			return NextResponse.json(
				{ error: "Product type is required" },
				{ status: 400 }
			);
		}

		if (!productName || !productName.trim()) {
			return NextResponse.json(
				{ error: "Product name is required" },
				{ status: 400 }
			);
		}

		if (!basePrice || parseFloat(basePrice) <= 0) {
			return NextResponse.json(
				{ error: "Base price is required and must be greater than 0" },
				{ status: 400 }
			);
		}

		// Insert product
		const { data, error } = await supabaseAdmin
			.from("products")
			.insert({
				owner_id: userId,
				product_type: productType,
				listing_type: listingType || null,
				product_name: productName.trim(),
				livestock_type: livestockType || null,
				cut_type: cutType || null,
				age: age ? parseInt(age) : null,
				unit_size: unitSize ? parseFloat(unitSize) : null,
				unit_measure: unitMeasure || null,
				storage_type: storageType || null,
				hs_code: hsCode || null,
				base_price: parseFloat(basePrice),
				description: description || null,
				status: "draft",
				images: images || [],
			})
			.select("*")
			.single();

		if (error) {
			console.error("Create product error:", error);
			return NextResponse.json(
				{ error: "Failed to create product" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true, product: data });
	} catch (error) {
		console.error("Create product error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
