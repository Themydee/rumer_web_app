import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/components/lib/supabase/client";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { assessor_id, order_id, latitude, longitude, speed, heading } = body;

		if (!assessor_id || !order_id || latitude === undefined || longitude === undefined) {
			return NextResponse.json(
				{ error: "Assessor ID, Order ID, Latitude and Longitude are required" },
				{ status: 400 }
			);
		}

		const { data: locationRecord, error } = await (supabase as any)
			.from("assessor_locations")
			.insert({
				assessor_id,
				order_id,
				latitude: Number(latitude),
				longitude: Number(longitude),
				speed: speed ? Number(speed) : null,
				heading: heading ? Number(heading) : null,
				updated_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (error) {
			console.error("Error updating assessor GPS location:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({
			message: "GPS location updated successfully.",
			location: locationRecord,
		});
	} catch (err: any) {
		return NextResponse.json({ error: err.message || "Failed to update GPS location" }, { status: 500 });
	}
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const orderId = searchParams.get("orderId");

		if (!orderId) {
			return NextResponse.json({ error: "Order ID parameter is required" }, { status: 400 });
		}

		const { data: locations, error } = await (supabase as any)
			.from("assessor_locations")
			.select("*")
			.eq("order_id", orderId)
			.order("updated_at", { ascending: false })
			.limit(50);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ locations: locations || [] });
	} catch (err: any) {
		return NextResponse.json({ error: err.message || "Failed to fetch GPS locations" }, { status: 500 });
	}
}
