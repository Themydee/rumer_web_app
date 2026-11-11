import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/components/lib/supabase/client";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: orderId } = await params;
		const body = await request.json();
		const { seller_id, cooperative_lead_id, failure_reason } = body;

		// 1. Fetch current order
		const { data: order, error: orderErr } = await (supabase as any)
			.from("orders")
			.select("*")
			.eq("id", orderId)
			.single();

		if (orderErr || !order) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		const penaltyAmount = 3000.0;
		const targetUserId = seller_id || order.seller_id;

		// 2. Log Order Failure
		const { data: failureRecord } = await (supabase as any)
			.from("order_failures")
			.insert({
				order_id: order.id,
				failure_type: "seller_failed_supply",
				initiator_id: targetUserId,
				penalty_amount: penaltyAmount,
				notes: failure_reason || "Seller/cooperative failed to supply stock",
			})
			.select()
			.single();

		// 3. Issue Strike to Seller / Cooperative
		let activeStrikes = 0;
		if (targetUserId) {
			const { data: strikeData } = await (supabase as any).rpc("issue_user_strike", {
				p_user_id: targetUserId,
				p_role: "seller",
				p_order_id: order.id,
				p_reason: `Failed to fulfill order ${order.order_id}`,
			});
			activeStrikes = strikeData || 0;
		}

		// 4. Record Negative Balance / Commission Penalty in Cooperative Lead's Wallet
		const leadUserId = cooperative_lead_id || targetUserId;
		if (leadUserId) {
			// Get or create wallet
			let { data: wallet } = await (supabase as any)
				.from("wallets")
				.select("*")
				.eq("user_id", leadUserId)
				.single();

			if (!wallet) {
				const { data: newWallet } = await (supabase as any)
					.from("wallets")
					.insert({ user_id: leadUserId, balance: 0.0 })
					.select()
					.single();
				wallet = newWallet;
			}

			if (wallet) {
				const newBalance = Number(wallet.balance) - penaltyAmount;

				await (supabase as any)
					.from("wallets")
					.update({ balance: newBalance, updated_at: new Date().toISOString() })
					.eq("id", wallet.id);

				await (supabase as any).from("wallet_transactions").insert({
					wallet_id: wallet.id,
					order_id: order.id,
					type: "lead_commission_forfeiture",
					amount: -penaltyAmount,
					balance_after: newBalance,
					description: `Penalty & commission forfeiture for order failure (${order.order_id})`,
					reference: `PENALTY-${order.order_id}-${Date.now()}`,
				});
			}
		}

		// 5. Instantly Reroute Order to Next Cooperative
		const reroutedOrderId = `RUM-${Math.floor(100000 + Math.random() * 900000)}`;
		const { data: reroutedOrder } = await (supabase as any)
			.from("orders")
			.insert({
				order_id: reroutedOrderId,
				buyer_id: order.buyer_id,
				product_id: order.product_id,
				product_name: order.product_name,
				product_type: order.product_type,
				quantity: order.quantity,
				unit_price: order.unit_price,
				total_amount: order.total_amount,
				status: "pending_confirmation",
				reassignment_deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
			})
			.select()
			.single();

		// 6. Update Original Order Status
		await (supabase as any)
			.from("orders")
			.update({
				status: "failed",
				updated_at: new Date().toISOString(),
			})
			.eq("id", order.id);

		if (failureRecord && reroutedOrder) {
			await (supabase as any)
				.from("order_failures")
				.update({ rerouted_order_id: reroutedOrder.id })
				.eq("id", failureRecord.id);
		}

		return NextResponse.json({
			message: "Seller failure processed. ₦3,000 penalty applied to wallet and order rerouted.",
			penaltyAmount,
			activeStrikes,
			reroutedOrder,
		});
	} catch (err: any) {
		return NextResponse.json({ error: err.message || "Seller failure processing failed" }, { status: 500 });
	}
}
