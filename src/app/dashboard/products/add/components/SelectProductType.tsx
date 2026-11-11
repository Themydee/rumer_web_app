"use client";

import React from "react";
import { Check } from "lucide-react";

interface SelectProductTypeProps {
	selected: "livestock" | "processed" | null;
	onSelect: (type: "livestock" | "processed") => void;
	onNext: () => void;
	onCancel: () => void;
}

const SelectProductType = ({
	selected,
	onSelect,
	onNext,
	onCancel,
}: SelectProductTypeProps) => {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="text-center mb-10">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					What type of product are you adding?
				</h2>
				<p className="text-gray-500">Choose the product category</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
				{/* Livestock Card */}
				<button
					onClick={() => onSelect("livestock")}
					className={`relative p-8 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
						selected === "livestock"
							? "border-[#014834] bg-[#f0faf5]"
							: "border-gray-200 bg-white hover:border-gray-300"
					}`}
				>
					{selected === "livestock" && (
						<div className="absolute top-4 left-4 w-6 h-6 bg-[#014834] rounded-full flex items-center justify-center">
							<Check className="w-4 h-4 text-white" />
						</div>
					)}
					<div className="mt-6">
						<div className="w-20 h-20 mb-4">
							<svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
								<path
									d="M15 55c0 0 5-20 25-20s25 20 25 20"
									stroke="#1a1a1a"
									strokeWidth="2"
									fill="none"
								/>
								<circle cx="25" cy="35" r="3" fill="#1a1a1a" />
								<circle cx="55" cy="35" r="3" fill="#1a1a1a" />
								<path
									d="M20 50c0 0 5 10 20 10s20-10 20-10"
									stroke="#1a1a1a"
									strokeWidth="2"
									fill="none"
								/>
								<ellipse cx="40" cy="45" rx="25" ry="15" stroke="#1a1a1a" strokeWidth="2" fill="none" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-1">
							Livestock
						</h3>
						<p className="text-sm text-gray-500">
							Live animals sold whole (cattle, goats, sheep, poultry)
						</p>
					</div>
				</button>

				{/* Processed Products Card */}
				<button
					onClick={() => onSelect("processed")}
					className={`relative p-8 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
						selected === "processed"
							? "border-[#014834] bg-[#f0faf5]"
							: "border-gray-200 bg-white hover:border-gray-300"
					}`}
				>
					{selected === "processed" && (
						<div className="absolute top-4 left-4 w-6 h-6 bg-[#014834] rounded-full flex items-center justify-center">
							<Check className="w-4 h-4 text-white" />
						</div>
					)}
					<div className="mt-6">
						<div className="w-20 h-20 mb-4">
							<svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
								<ellipse cx="40" cy="45" rx="28" ry="18" stroke="#1a1a1a" strokeWidth="2" fill="none" />
								<path
									d="M15 40c0 0 10-20 25-20s25 20 25 20"
									stroke="#1a1a1a"
									strokeWidth="2"
									fill="none"
								/>
								<path d="M30 35c5 5 15 5 20 0" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-1">
							Processed Products
						</h3>
						<p className="text-sm text-gray-500">
							Meat cuts, packaged or processed animal products
						</p>
					</div>
				</button>
			</div>

			{/* Buttons */}
			<div className="flex flex-col sm:flex-row gap-4">
				<button
					onClick={onCancel}
					className="px-8 py-3.5 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition flex-1 sm:flex-none"
				>
					Cancel
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

export default SelectProductType;
