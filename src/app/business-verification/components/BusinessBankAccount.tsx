"use client";
import React, { useState } from "react";
import BusinessVerificationLayout from "./BusinessVerificationLayout";
import { BusinessData } from "./types";

const BANKS = [
	"Access Bank",
	"Citibank Nigeria",
	"Ecobank Nigeria",
	"Fidelity Bank Nigeria",
	"First Bank of Nigeria",
	"First City Monument Bank",
	"GTCO (GTBank)",
	"Heritage Bank",
	"Keystone Bank",
	"Opay",
	"Polaris Bank",
	"Providus Bank",
	"Stanbic IBTC Bank",
	"Standard Chartered Bank",
	"Sterling Bank",
	"SunTrust Bank",
	"Titan Trust Bank",
	"Union Bank of Nigeria",
	"United Bank for Africa (UBA)",
	"Unity Bank",
	"Wema Bank",
	"Zenith Bank",
];

interface BusinessBankAccountProps {
	formData: BusinessData;
	onNext: (data: Partial<BusinessData>) => void;
	onBack: () => void;
}

const BusinessBankAccount = ({
	formData,
	onNext,
	onBack,
}: BusinessBankAccountProps) => {
	const [bankName, setBankName] = useState(formData.bankName || "");
	const [accountNumber, setAccountNumber] = useState(formData.accountNumber || "");
	const [accountName, setAccountName] = useState(formData.accountName || "");

	const handleContinue = () => {
		onNext({ bankName, accountNumber, accountName });
	};

	return (
		<BusinessVerificationLayout step={2} total={5} onBack={onBack}>
			<div>
				<h3 className="text-2xl font-bold text-gray-900 mb-2">
					Business Bank Account
				</h3>
				<p className="text-sm text-gray-500 mb-8">
					Add a business bank account to receive payments.
				</p>

				<div className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Bank Name
						</label>
						<div className="relative">
							<select
								value={bankName}
								onChange={(e) => setBankName(e.target.value)}
								className="w-full px-4 py-3 border border-gray-250 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition appearance-none bg-white"
							>
								<option value="">Select Bank Name</option>
								{BANKS.map((bank) => (
									<option key={bank} value={bank}>
										{bank}
									</option>
								))}
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

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Account Number
						</label>
						<input
							type="text"
							value={accountNumber}
							onChange={(e) =>
								setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
							}
							placeholder="Enter account number"
							className="w-full px-4 py-3 border border-gray-250 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Account Name
						</label>
						<input
							type="text"
							value={accountName}
							onChange={(e) => setAccountName(e.target.value)}
							placeholder="Enter account name"
							className="w-full px-4 py-3 border border-gray-250 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition"
						/>
					</div>
				</div>

				<div className="flex gap-3 mt-8">
					<button
						onClick={onBack}
						className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 hover:bg-gray-100 transition"
					>
						Cancel
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

export default BusinessBankAccount;
