"use client";

import React from "react";
import { Check } from "lucide-react";

interface ProductListingTypeProps {
	selected: "individual" | "bulk" | null;
	onSelect: (type: "individual" | "bulk") => void;
	onNext: () => void;
	onBack: () => void;
}

const ProductListingType = ({
	selected,
	onSelect,
	onNext,
	onBack,
}: ProductListingTypeProps) => {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="text-center mb-10">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					How will this livestock be listed?
				</h2>
				<p className="text-gray-500 max-w-xl mx-auto">
					Choose Individual if you want to track each animal separately. Choose
					Bulk if selling a group of animals together.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
				{/* Individual Card */}
				<button
					onClick={() => onSelect("individual")}
					className={`relative p-8 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
						selected === "individual"
							? "border-[#014834] bg-[#f0faf5]"
							: "border-gray-200 bg-white hover:border-gray-300"
					}`}
				>
					{selected === "individual" && (
						<div className="absolute top-4 left-4 w-6 h-6 bg-[#014834] rounded-full flex items-center justify-center">
							<Check className="w-4 h-4 text-white" />
						</div>
					)}
					<div className="mt-6">
						<div className="w-20 h-20 mb-4">
							<svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
								<rect x="20" y="20" width="40" height="40" rx="4" stroke="#1a1a1a" strokeWidth="2" fill="none" />
								<line x1="20" y1="20" x2="40" y2="40" stroke="#1a1a1a" strokeWidth="1.5" />
								<line x1="60" y1="20" x2="40" y2="40" stroke="#1a1a1a" strokeWidth="1.5" />
								<rect x="30" y="10" width="20" height="10" rx="2" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-[#014834] mb-1">
							Individual (1-of-1)
						</h3>
						<p className="text-sm text-gray-500">
							Each animal tracked separately with unique details
						</p>
					</div>
				</button>

				{/* Bulk Card */}
				<button
					onClick={() => onSelect("bulk")}
					className={`relative p-8 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
						selected === "bulk"
							? "border-[#014834] bg-[#f0faf5]"
							: "border-gray-200 bg-white hover:border-gray-300"
					}`}
				>
					{selected === "bulk" && (
						<div className="absolute top-4 left-4 w-6 h-6 bg-[#014834] rounded-full flex items-center justify-center">
							<Check className="w-4 h-4 text-white" />
						</div>
					)}
					<div className="mt-6">
						<div className="w-20 h-20 mb-4">
							<svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
								<rect x="10" y="30" width="25" height="25" rx="3" stroke="#1a1a1a" strokeWidth="2" fill="none" />
								<rect x="45" y="30" width="25" height="25" rx="3" stroke="#1a1a1a" strokeWidth="2" fill="none" />
								<rect x="25" y="10" width="25" height="25" rx="3" stroke="#1a1a1a" strokeWidth="2" fill="none" />
								<line x1="25" y1="10" x2="37" y2="22" stroke="#1a1a1a" strokeWidth="1.5" />
								<line x1="50" y1="10" x2="37" y2="22" stroke="#1a1a1a" strokeWidth="1.5" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-1">Bulk</h3>
						<p className="text-sm text-gray-500">
							Animals sold as a group without individual tracking
						</p>
					</div>
				</button>
			</div>

			{/* Buttons */}
			<div className="flex flex-col sm:flex-row gap-4">
				<button
					onClick={onBack}
					className="px-8 py-3.5 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition flex-1 sm:flex-none"
				>
					Back
				</button>
				<button
					onClick={onNext}
					disabled={!selected}
					className={`px-8 py-3.5 rounded-xl font-medium transition flex-1 sm:flex-none ${
						selected
							? "bg-[#014834] text-white hover:bg-[#013824]"
							: "bg-gray-200 text-gray-400 cursor-not-allowed"
					}`}
				>
					Next Step
				</button>
			</div>
		</div>
	);
};

export default ProductListingType;
