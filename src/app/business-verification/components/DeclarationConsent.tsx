"use client";
import React, { useState } from "react";
import BusinessVerificationLayout from "./BusinessVerificationLayout";
import { BusinessData } from "./types";

interface DeclarationConsentProps {
	formData: BusinessData;
	onNext: (data: Partial<BusinessData>) => void;
	onBack: () => void;
}

const DeclarationConsent = ({
	formData,
	onNext,
	onBack,
}: DeclarationConsentProps) => {
	const [declarationConsent, setDeclarationConsent] = useState(
		formData.declarationConsent || false
	);
	const [termsConsent, setTermsConsent] = useState(
		formData.termsConsent || false
	);

	const handleContinue = () => {
		onNext({ declarationConsent, termsConsent });
	};

	return (
		<BusinessVerificationLayout step={4} total={5} onBack={onBack}>
			<div>
				<h3 className="text-2xl font-bold text-gray-900 mb-8">
					Declaration & Consent
				</h3>

				<div className="space-y-6">
					<label className="flex items-start gap-3 cursor-pointer">
						<input
							type="checkbox"
							checked={declarationConsent}
							onChange={(e) => setDeclarationConsent(e.target.checked)}
							className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#014834] focus:ring-[#014834]"
						/>
						<span className="text-sm text-gray-700">
							I declare that all information provided is true and accurate to
							the best of my knowledge.
						</span>
					</label>

					<label className="flex items-start gap-3 cursor-pointer">
						<input
							type="checkbox"
							checked={termsConsent}
							onChange={(e) => setTermsConsent(e.target.checked)}
							className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#014834] focus:ring-[#014834]"
						/>
						<span className="text-sm text-gray-700">
							I agree to the{" "}
							<a href="#" className="text-[#014834] underline">
								Terms of Service
							</a>{" "}
							and{" "}
							<a href="#" className="text-[#014834] underline">
								Privacy Policy
							</a>
							.
						</span>
					</label>
				</div>

				<div className="flex gap-3 mt-8">
					<button
						onClick={onBack}
						className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 hover:bg-gray-100 transition"
					>
						Back to Dashboard
					</button>
					<button
						onClick={handleContinue}
						disabled={!declarationConsent || !termsConsent}
						className="px-6 py-3 bg-[#014834] text-white rounded-xl text-sm font-semibold hover:bg-[#013824] transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Continue
					</button>
				</div>
			</div>
		</BusinessVerificationLayout>
	);
};

export default DeclarationConsent;
