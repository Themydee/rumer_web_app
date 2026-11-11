"use client";
import React, { useState } from "react";
import CoopLayout from "./CoopLayout";

interface CooperativeBankAccountProps {
	formData: {
		bankName: string;
		accountNumber: string;
		accountName: string;
	};
	onNext: (data: {
		bankName: string;
		accountNumber: string;
		accountName: string;
	}) => void;
	onBack: () => void;
}

const CooperativeBankAccount = ({ formData, onNext, onBack }: CooperativeBankAccountProps) => {
	const [bankName, setBankName] = useState(formData.bankName);
	const [accountNumber, setAccountNumber] = useState(formData.accountNumber);
	const [accountName, setAccountName] = useState(formData.accountName);

	const handleSubmit = () => {
		onNext({ bankName, accountNumber, accountName });
	};

	const inputClass =
		"w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400";

	return (
		<CoopLayout step={6} total={7} onBack={onBack}>
			<div>
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900 leading-snug">
						Cooperative Bank Account
					</h1>
					<p className="text-gray-500 mt-2 text-sm">
						Provide the cooperative&apos;s official bank account details.
					</p>
				</div>

				<div className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">Bank Name</label>
						<input
							type="text"
							placeholder="Enter bank name"
							value={bankName}
							onChange={(e) => setBankName(e.target.value)}
							className={inputClass}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Account Number
						</label>
						<input
							type="text"
							placeholder="Enter account number"
							value={accountNumber}
							onChange={(e) => setAccountNumber(e.target.value)}
							className={inputClass}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Account Name
						</label>
						<input
							type="text"
							placeholder="Enter account name"
							value={accountName}
							onChange={(e) => setAccountName(e.target.value)}
							className={inputClass}
						/>
					</div>

					<div className="pt-4">
						<button
							onClick={handleSubmit}
							disabled={!bankName || !accountNumber || !accountName}
							className="w-full py-4 rounded-2xl bg-[#014834] text-white text-base font-semibold hover:bg-[#013628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Continue
						</button>
					</div>
				</div>
			</div>
		</CoopLayout>
	);
};

export default CooperativeBankAccount;
