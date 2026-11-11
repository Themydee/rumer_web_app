"use client";
import React, { useState } from "react";
import BusinessVerificationLayout from "./BusinessVerificationLayout";
import FileUpload from "./FileUpload";
import { BusinessData } from "./types";

interface BusinessAddressVerificationProps {
	formData: BusinessData;
	onNext: (data: Partial<BusinessData>) => void;
	onBack: () => void;
}

const BusinessAddressVerification = ({
	formData,
	onNext,
	onBack,
}: BusinessAddressVerificationProps) => {
	const [proofType, setProofType] = useState(formData.proofOfAddressType || "");
	const [proofFile, setProofFile] = useState<File | null>(
		formData.proofOfAddressFile || null
	);

	const handleContinue = () => {
		onNext({ proofOfAddressType: proofType, proofOfAddressFile: proofFile });
	};

	return (
		<BusinessVerificationLayout step={3} total={5} onBack={onBack}>
			<div>
				<h3 className="text-2xl font-bold text-gray-900 mb-2">
					Business Address Verification
				</h3>
				<p className="text-sm text-gray-500 mb-8">
					Kindly upload a document that shows your business address.
				</p>

				<div className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Proof of Business Address
						</label>
						<div className="relative">
							<select
								value={proofType}
								onChange={(e) => setProofType(e.target.value)}
								className="w-full px-4 py-3 border border-gray-250 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition appearance-none bg-white"
							>
								<option value="">Select document type</option>
								<option value="utility_bill">Utility Bill</option>
								<option value="tenancy_agreement">Tenancy Agreement</option>
								<option value="business_license">Business License</option>
								<option value="bank_statement">Bank Statement</option>
							</select>
							<svg
								className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					</div>

					<FileUpload
						label="Business/Utility Bill / Tenancy Agreement"
						file={proofFile}
						onChange={setProofFile}
						description="Document must be dated within the last 3 months"
					/>

					<p className="text-xs text-gray-500">
						You can only upload one document at a time.
					</p>
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
						className="px-6 py-3 bg-[#014834] text-white rounded-xl text-sm font-semibold hover:bg-[#013824] transition"
					>
						Continue
					</button>
				</div>
			</div>
		</BusinessVerificationLayout>
	);
};

export default BusinessAddressVerification;
