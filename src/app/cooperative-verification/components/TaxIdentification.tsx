"use client";
import React, { useState } from "react";
import CoopLayout from "./CoopLayout";

interface TaxIdentificationProps {
	formData: { tin: string };
	onNext: (data: { tin: string }) => void;
	onBack: () => void;
}

const TaxIdentification = ({ formData, onNext, onBack }: TaxIdentificationProps) => {
	const [tin, setTin] = useState(formData.tin);

	const handleSubmit = () => {
		onNext({ tin });
	};

	return (
		<CoopLayout step={2} total={7} onBack={onBack}>
			<div>
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900 leading-snug">
						Tax Identification Number
					</h1>
					<p className="text-gray-500 mt-2 text-sm">
						Provide your cooperative&apos;s Tax Identification Number (TIN).
					</p>
				</div>

				<div className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							TIN
						</label>
						<input
							type="text"
							placeholder="Enter TIN"
							value={tin}
							onChange={(e) => setTin(e.target.value)}
							className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400"
						/>
					</div>

					<div className="pt-4">
						<button
							onClick={handleSubmit}
							disabled={!tin}
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

export default TaxIdentification;
