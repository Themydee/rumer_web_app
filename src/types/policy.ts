export type OrderStatus =
	| "pending_confirmation"
	| "confirmed"
	| "assessor_dispatched"
	| "quality_checked"
	| "in_transit"
	| "completed"
	| "cancelled"
	| "failed"
	| "reassigned";

export type FailureType =
	| "buyer_cancelled_pre_confirmation"
	| "buyer_cancelled_post_confirmation"
	| "seller_failed_supply"
	| "stock_not_ready_assessor"
	| "quality_rejected_seller_fault"
	| "quality_rejected_unavoidable"
	| "logistics_seller_delay_disappeared"
	| "buyer_rejected_quality_valid";

export interface UserStrike {
	id: string;
	userId: string;
	role: "buyer" | "seller" | "cooperative";
	orderId?: string;
	reason: string;
	issuedAt: string;
	expiresAt: string;
	isActive: boolean;
}

export interface OrderFailureRecord {
	id: string;
	orderId: string;
	failureType: FailureType;
	initiatorId: string;
	penaltyAmount: number;
	assessorFeeCharged: number;
	logisticsFeeCharged: number;
	notes?: string;
	proofImages?: string[];
	reroutedOrderId?: string;
	createdAt: string;
}

export interface AssessorLocation {
	id: string;
	assessorId: string;
	orderId: string;
	latitude: number;
	longitude: number;
	speed?: number;
	heading?: number;
	updatedAt: string;
}

export interface CancellationPenaltyCalculation {
	isPostConfirmation: boolean;
	cancellationFee: number; // ₦3,000 MVP fee if post confirmation
	assessorFee: number;
	logisticsFee: number;
	totalDeductions: number;
	refundAmount: number;
	strikeApplied: boolean;
}
