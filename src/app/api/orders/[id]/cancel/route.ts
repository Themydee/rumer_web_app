import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/components/lib/supabase/client";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: orderId } = await params;
		const body = await request.json();
		const { buyer_id, reason } = body;

		if (!buyer_id) {
			return NextResponse.json({ error: "Buyer ID is required" }, { status: 400 });
		}

		// 1. Fetch current order
		const { data: order, error: orderErr } = await (supabase as any)
			.from("orders")
			.select("*")
			.eq("id", orderId)
			.single();

		if (orderErr || !order) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		if (order.status === "cancelled" || order.status === "completed") {
			return NextResponse.json(
				{ error: `Order is already ${order.status}` },
				{ status: 400 }
			);
		}

		const isPostConfirmation = order.status !== "pending_confirmation";
		const penaltyAmount = isPostConfirmation ? 3000.0 : 0.0;
		const assessorFeeCharged =
			order.status === "assessor_dispatched" || order.status === "quality_checked"
				? Number(order.assessor_fee || 0)
				: 0.0;
		const logisticsFeeCharged =
			order.status === "in_transit" ? Number(order.logistics_fee || 0) : 0.0;

		const totalDeductions = penaltyAmount + assessorFeeCharged + logisticsFeeCharged;
		const refundAmount = Math.max(0, Number(order.total_amount) - totalDeductions);

		const failureType = isPostConfirmation
			? "buyer_cancelled_post_confirmation"
			: "buyer_cancelled_pre_confirmation";

		// 2. Log Order Failure
		const { data: failureRecord, error: failureErr } = await (supabase as any)
			.from("order_failures")
			.insert({
				order_id: order.id,
				failure_type: failureType,
				initiator_id: buyer_id,
				penalty_amount: penaltyAmount,
				assessor_fee_charged: assessorFeeCharged,
				logistics_fee_charged: logisticsFeeCharged,
				notes: reason || "Buyer requested cancellation",
			})
			.select()
			.single();

		if (failureErr) {
			console.error("Failed to insert order failure record:", failureErr);
		}

		// 3. Issue Strike if post confirmation
		let activeStrikes = 0;
		if (isPostConfirmation) {
			const { data: strikeData } = await (supabase as any).rpc("issue_user_strike", {
				p_user_id: buyer_id,
				p_role: "buyer",
				p_order_id: order.id,
				p_reason: `Cancelled order ${order.order_id} after confirmation`,
			});
			activeStrikes = strikeData || 0;
		}

		// 4. Update Order Status
		const { error: updateErr } = await (supabase as any)
			.from("orders")
			.update({
				status: "cancelled",
				updated_at: new Date().toISOString(),
			})
			.eq("id", order.id);

		if (updateErr) {
			return NextResponse.json({ error: updateErr.message }, { status: 500 });
		}

		// 5. Relist / Reassign order to next available cooperative if active
		let reroutedOrder = null;
		if (order.product_id) {
			const reroutedOrderId = `RUM-${Math.floor(100000 + Math.random() * 900000)}`;
			const { data: newOrder } = await (supabase as any)
				.from("orders")
				.insert({
					order_id: reroutedOrderId,
					buyer_id: order.buyer_id, // Keep buyer request alive for matching supply
					product_id: order.product_id,
					product_name: order.product_name,
					product_type: order.product_type,
					quantity: order.quantity,
					unit_price: order.unit_price,
					total_amount: order.total_amount,
					status: "pending_confirmation",
				})
				.select()
				.single();

			reroutedOrder = newOrder;
			if (failureRecord && newOrder) {
				await (supabase as any)
					.from("order_failures")
					.update({ rerouted_order_id: newOrder.id })
					.eq("id", failureRecord.id);
			}
		}

		return NextResponse.json({
			message: isPostConfirmation
				? "Order cancelled. Cancellation fee and dispatched service fees applied."
				: "Order cancelled successfully. Full refund issued.",
			calculation: {
				isPostConfirmation,
				penaltyAmount,
				assessorFeeCharged,
				logisticsFeeCharged,
				totalDeductions,
				refundAmount,
				activeStrikes,
			},
			reroutedOrder,
		});
	} catch (err: any) {
		return NextResponse.json({ error: err.message || "Cancellation failed" }, { status: 500 });
	}
}
