"use client";
import React from "react";
import BusinessVerificationLayout from "./BusinessVerificationLayout";
import { Check } from "lucide-react";

interface SubmittingBusinessVerificationProps {
	onContinue: () => void;
	onBackToDashboard: () => void;
}

const SubmittingBusinessVerification = ({
	onContinue,
	onBackToDashboard,
}: SubmittingBusinessVerificationProps) => {
	return (
		<BusinessVerificationLayout step={5} total={5} showBack={false}>
			<div className="text-center py-8">
				<div className="w-16 h-16 bg-[#014834] rounded-full flex items-center justify-center mx-auto mb-6">
					<Check className="w-8 h-8 text-white" />
				</div>

				<h3 className="text-2xl font-bold text-gray-900 mb-3">
					Submitting documents for verification...
				</h3>

				<p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
					Your business verification is under review. You&apos;ll be notified
					once it&apos;s approved.
				</p>

				<div className="flex gap-3 justify-center">
					<button
						onClick={onBackToDashboard}
						className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 hover:bg-gray-100 transition"
					>
						Back to Dashboard
					</button>
					<button
						onClick={onContinue}
						className="px-6 py-3 bg-[#014834] text-white rounded-xl text-sm font-semibold hover:bg-[#013824] transition"
					>
						Continue
					</button>
				</div>
			</div>
		</BusinessVerificationLayout>
	);
};

export default SubmittingBusinessVerification;
