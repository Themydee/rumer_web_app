import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/components/lib/supabase/client";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status");
		const buyerId = searchParams.get("buyerId");
		const sellerId = searchParams.get("sellerId");

		let query = (supabase as any).from("orders").select("*").order("created_at", { ascending: false });

		if (status && status !== "all") {
			query = query.eq("status", status);
		}
		if (buyerId) {
			query = query.eq("buyer_id", buyerId);
		}
		if (sellerId) {
			query = query.eq("seller_id", sellerId);
		}

		const { data: orders, error } = await query;

		if (error) {
			console.error("Error fetching orders:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ orders: orders || [] });
	} catch (err: any) {
		return NextResponse.json({ error: err.message || "Failed to fetch orders" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			buyer_id,
			seller_id,
			cooperative_id,
			product_id,
			product_name,
			product_type,
			quantity,
			unit_price,
			assessor_fee,
			logistics_fee,
		} = body;

		if (!buyer_id || !product_name || !quantity || !unit_price) {
			return NextResponse.json({ error: "Missing required order fields" }, { status: 400 });
		}

		const total_amount = Number(quantity) * Number(unit_price);

		// KYC Payment gating on seller
		if (seller_id) {
			const { data: sellerProfile } = await (supabase as any)
				.from("profiles")
				.select("kyc_tier, is_verified, cooperative_id, is_sole_proprietor")
				.eq("id", seller_id)
				.single();

			if (sellerProfile) {
				const tier = sellerProfile.kyc_tier ?? (sellerProfile.is_verified ? "tier_1" : "tier_0");
				if (tier === "tier_0") {
					return NextResponse.json(
						{
							error: "Seller is currently Tier 0 (Basic) and cannot receive payments. Tier 1 KYC verification is required.",
							code: "SELLER_KYC_TIER_0_RESTRICTED",
						},
						{ status: 400 }
					);
				}

				// High value direct transaction limit for individual Tier 1 sellers (exceeding ₦1,000,000 without coop or Tier 3)
				const isHighValue = total_amount > 1000000;
				if (tier === "tier_1" && isHighValue && !sellerProfile.cooperative_id && !sellerProfile.is_sole_proprietor) {
					return NextResponse.json(
						{
							error: "Orders above ₦1,000,000 require the seller to be operating under a verified Cooperative (Tier 2) or registered business (Tier 3).",
							code: "HIGH_VALUE_TRANSACTION_TIER_RESTRICTION",
						},
						{ status: 400 }
					);
				}
			}
		}

		const order_id = `RUM-${Math.floor(100000 + Math.random() * 900000)}`;

		const { data: order, error } = await (supabase as any)
			.from("orders")
			.insert({
				order_id,
				buyer_id,
				seller_id: seller_id || null,
				cooperative_id: cooperative_id || null,
				product_id: product_id || null,
				product_name,
				product_type: product_type || "livestock",
				quantity: Number(quantity),
				unit_price: Number(unit_price),
				total_amount,
				cancellation_fee: 3000.0,
				assessor_fee: Number(assessor_fee || 0),
				logistics_fee: Number(logistics_fee || 0),
				status: "pending_confirmation",
			})
			.select()
			.single();

		if (error) {
			console.error("Error creating order:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ order, message: "Order placed successfully" });
	} catch (err: any) {
		return NextResponse.json({ error: err.message || "Failed to create order" }, { status: 500 });
	}
}
