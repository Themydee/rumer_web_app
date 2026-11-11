"use client";
import React, { useState } from "react";
import BusinessVerificationLayout from "./BusinessVerificationLayout";
import FileUpload from "./FileUpload";
import { BusinessData } from "./types";

interface VerifyRegisteredBusinessProps {
	formData: BusinessData;
	onNext: (data: Partial<BusinessData>) => void;
	onBack: () => void;
}

const VerifyRegisteredBusiness = ({
	formData,
	onNext,
	onBack,
}: VerifyRegisteredBusinessProps) => {
	const [businessName, setBusinessName] = useState(formData.businessName || "");
	const [cacFile, setCacFile] = useState<File | null>(formData.cacFile || null);
	const [cacStatus, setCacStatus] = useState(formData.cacStatus || "");

	const handleContinue = () => {
		onNext({ businessName, cacFile, cacStatus });
	};

	return (
		<BusinessVerificationLayout step={1} total={5} onBack={onBack}>
			<div>
				<h3 className="text-2xl font-bold text-gray-900 mb-2">
					Verify Your Registered Business
				</h3>
				<p className="text-sm text-gray-500 mb-8">
					Complete business verification to accept seamless payments and access
					all platform features.
				</p>

				<div className="space-y-6">
					<div>
						<h4 className="text-sm font-semibold text-gray-900 mb-4">
							Business Details
						</h4>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Registered Business Name
						</label>
						<input
							type="text"
							value={businessName}
							onChange={(e) => setBusinessName(e.target.value)}
							placeholder="Enter registered business name"
							className="w-full px-4 py-3 border border-gray-250 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition"
						/>
					</div>

					<FileUpload
						label="CAC Documentation"
						file={cacFile}
						onChange={setCacFile}
						description="Certificate of Incorporation / Registration"
					/>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							CAC Status Report / Form CO2 & CO7 if applicable
						</label>
						<div className="relative">
							<select
								value={cacStatus}
								onChange={(e) => setCacStatus(e.target.value)}
								className="w-full px-4 py-3 border border-gray-250 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition appearance-none bg-white"
							>
								<option value="">Select document type</option>
								<option value="status_report">CAC Status Report</option>
								<option value="form_co2">Form CO2</option>
								<option value="form_co7">Form CO7</option>
								<option value="not_applicable">Not Applicable</option>
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

export default VerifyRegisteredBusiness;
