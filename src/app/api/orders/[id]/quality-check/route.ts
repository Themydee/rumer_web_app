import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/components/lib/supabase/client";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: orderId } = await params;
		const body = await request.json();
		const {
			assessor_id,
			passed,
			is_seller_fault,
			notes,
			proof_images,
		} = body;

		if (!assessor_id) {
			return NextResponse.json({ error: "Assessor ID is required" }, { status: 400 });
		}

		// 1. Fetch Order
		const { data: order, error: orderErr } = await (supabase as any)
			.from("orders")
			.select("*")
			.eq("id", orderId)
			.single();

		if (orderErr || !order) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		if (passed) {
			// Quality Check Passed
			const { data: updatedOrder } = await (supabase as any)
				.from("orders")
				.update({
					status: "quality_checked",
					updated_at: new Date().toISOString(),
				})
				.eq("id", order.id)
				.select()
				.single();

			return NextResponse.json({
				message: "Quality check passed successfully.",
				order: updatedOrder,
			});
		}

		// Quality Check Rejected
		const failureType = is_seller_fault
			? "quality_rejected_seller_fault"
			: "quality_rejected_unavoidable";
		const penaltyAmount = is_seller_fault ? 3000.0 : 0.0;

		// 2. Log Order Failure
		await (supabase as any).from("order_failures").insert({
			order_id: order.id,
			failure_type: failureType,
			initiator_id: assessor_id,
			penalty_amount: penaltyAmount,
			notes: notes || (is_seller_fault ? "Rejected due to seller quality mismatch" : "Unavoidable natural quality issue"),
			proof_images: proof_images || [],
		});

		let activeStrikes = 0;
		let replacementDeadline = null;

		if (is_seller_fault) {
			// 3. Issue strike if seller fault
			if (order.seller_id) {
				const { data: strikeData } = await (supabase as any).rpc("issue_user_strike", {
					p_user_id: order.seller_id,
					p_role: "seller",
					p_order_id: order.id,
					p_reason: `Quality check failed due to weight/health/condition mismatch on order ${order.order_id}`,
				});
				activeStrikes = strikeData || 0;
			}

			// Set 4-Hour Replacement SLA
			replacementDeadline = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();

			await (supabase as any)
				.from("orders")
				.update({
					status: "failed",
					replacement_deadline: replacementDeadline,
					updated_at: new Date().toISOString(),
				})
				.eq("id", order.id);
		} else {
			// Unavoidable failure - no penalty or strike
			await (supabase as any)
				.from("orders")
				.update({
					status: "failed",
					updated_at: new Date().toISOString(),
				})
				.eq("id", order.id);
		}

		return NextResponse.json({
			message: is_seller_fault
				? "Quality check rejected (Seller Fault). ₦3,000 penalty & strike issued. 4-hour replacement SLA started."
				: "Quality check rejected (Unavoidable Natural Cause). No penalty charged.",
			is_seller_fault,
			penaltyAmount,
			activeStrikes,
			replacementDeadline,
		});
	} catch (err: any) {
		return NextResponse.json({ error: err.message || "Quality check processing failed" }, { status: 500 });
	}
}
