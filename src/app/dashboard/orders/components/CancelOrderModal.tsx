"use client";

import React, { useState } from "react";
import { AlertTriangle, X, ShieldAlert, CheckCircle2, Clock } from "lucide-react";

interface CancelOrderModalProps {
	isOpen: boolean;
	order: {
		id: string;
		order_id: string;
		product_name: string;
		total_amount: number;
		status: string;
		assessor_fee?: number;
		logistics_fee?: number;
	} | null;
	buyerId: string;
	onClose: () => void;
	onSuccess: () => void;
}

export default function CancelOrderModal({
	isOpen,
	order,
	buyerId,
	onClose,
	onSuccess,
}: CancelOrderModalProps) {
	const [reason, setReason] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!isOpen || !order) return null;

	const isPostConfirmation = order.status !== "pending_confirmation";
	const penaltyFee = isPostConfirmation ? 3000 : 0;
	const assessorFee =
		order.status === "assessor_dispatched" || order.status === "quality_checked"
			? Number(order.assessor_fee || 0)
			: 0;
	const logisticsFee = order.status === "in_transit" ? Number(order.logistics_fee || 0) : 0;

	const totalDeductions = penaltyFee + assessorFee + logisticsFee;
	const estimatedRefund = Math.max(0, order.total_amount - totalDeductions);

	const handleCancelOrder = async () => {
		if (!reason.trim()) {
			setError("Please provide a reason for cancelling this order.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const res = await fetch(`/api/orders/${order.id}/cancel`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					buyer_id: buyerId,
					reason,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to cancel order");
			}

			onSuccess();
			onClose();
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
				{/* Header */}
				<div className="flex items-center justify-between pb-4 border-b border-gray-100">
					<div className="flex items-center gap-2">
						<AlertTriangle className="w-5 h-5 text-red-600" />
						<h3 className="text-lg font-bold text-gray-900">Cancel Order</h3>
					</div>
					<button
						onClick={onClose}
						className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Order Summary */}
				<div className="my-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
					<p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
						Order #{order.order_id}
					</p>
					<p className="text-base font-bold text-gray-900 mt-1">{order.product_name}</p>
					<p className="text-sm font-semibold text-[#014834] mt-1">
						Total Paid: ₦{order.total_amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
					</p>
				</div>

				{/* Fee Breakdown */}
				<div className="mb-4 space-y-2">
					<p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
						Cancellation & Refund Breakdown
					</p>
					{isPostConfirmation ? (
						<div className="space-y-1.5 text-xs">
							<div className="flex justify-between text-gray-600">
								<span>Cancellation Fee (MVP Standard):</span>
								<span className="font-semibold text-red-600">-₦3,000.00</span>
							</div>
							{assessorFee > 0 && (
								<div className="flex justify-between text-gray-600">
									<span>Dispatched Assessor Fee:</span>
									<span className="font-semibold text-red-600">-₦{assessorFee.toLocaleString()}</span>
								</div>
							)}
							{logisticsFee > 0 && (
								<div className="flex justify-between text-gray-600">
									<span>Dispatched Delivery Fee:</span>
									<span className="font-semibold text-red-600">-₦{logisticsFee.toLocaleString()}</span>
								</div>
							)}
							<div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
								<span>Estimated Refund:</span>
								<span className="text-[#014834]">
									₦{estimatedRefund.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
								</span>
							</div>
						</div>
					) : (
						<div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-800 text-xs font-medium border border-green-200">
							<CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
							<span>Order is unconfirmed. You will receive a 100% full refund with ₦0 penalty.</span>
						</div>
					)}
				</div>

				{/* Strike Warning */}
				{isPostConfirmation && (
					<div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2.5">
						<ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
						<div className="text-xs text-amber-800">
							<p className="font-bold">30-Day Rolling Strike Warning</p>
							<p className="mt-0.5">
								Cancelling after confirmation adds 1 strike to your account. Strikes reset after 30 days without new cancellations.
							</p>
						</div>
					</div>
				)}

				{/* Reason Input */}
				<div className="mb-4">
					<label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
						Reason for Cancellation <span className="text-red-500">*</span>
					</label>
					<textarea
						rows={3}
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder="Please state why you are cancelling this order..."
						className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#014834] transition text-gray-900 placeholder:text-gray-400"
					/>
				</div>

				{error && <p className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg">{error}</p>}

				{/* Actions */}
				<div className="flex items-center gap-3 pt-2">
					<button
						type="button"
						onClick={onClose}
						disabled={loading}
						className="flex-1 py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
					>
						Keep Order
					</button>
					<button
						type="button"
						onClick={handleCancelOrder}
						disabled={loading}
						className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
					>
						{loading ? (
							<>
								<Clock className="w-4 h-4 animate-spin" />
								<span>Processing...</span>
							</>
						) : (
							<span>Confirm Cancel</span>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
