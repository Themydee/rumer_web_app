"use client";

import React from "react";
import { ProductFormData } from "./AddProductPage";
import { Package, Box } from "lucide-react";

interface ConfirmReviewProps {
	formData: ProductFormData;
	onBack: () => void;
	onCreate: () => void;
	submitting?: boolean;
	error?: string | null;
}

const ConfirmReview = ({ formData, onBack, onCreate, submitting, error }: ConfirmReviewProps) => {
	const isLivestock = formData.productType === "livestock";
	const formatPrice = (price: string) => {
		const num = parseFloat(price);
		if (isNaN(num)) return "₦0";
		return `₦${num.toLocaleString()}`;
	};

	return (
		<div className="max-w-3xl mx-auto">
			<div className="text-center mb-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Review Product
				</h2>
				<p className="text-gray-500">Confirm the product details</p>
			</div>

			<div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
				{/* Product Header */}
				<div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
					<div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
						{isLivestock ? (
							<svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
								<path
									d="M8 30c0 0 3-12 12-12s12 12 12 12"
									stroke="#1a1a1a"
									strokeWidth="1.5"
									fill="none"
								/>
								<circle cx="13" cy="18" r="2" fill="#1a1a1a" />
								<circle cx="27" cy="18" r="2" fill="#1a1a1a" />
							</svg>
						) : (
							<Package className="w-10 h-10 text-gray-400" />
						)}
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-900">
							{formData.productName || "Product Name"}
						</h3>
						<div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
							<Box className="w-3 h-3" />
							<span>
								{formData.listingType === "individual"
									? "1-of-1"
									: formData.listingType === "bulk"
									? "Bulk"
									: "-"}
							</span>
						</div>
					</div>
				</div>

				{/* Details */}
				<div className="space-y-4">
					<div className="flex justify-between py-2">
						<span className="text-gray-500">Type</span>
						<span className="text-gray-900 font-medium">
							{isLivestock ? "Livestock" : "Processed Product"}
						</span>
					</div>
					<div className="flex justify-between py-2">
						<span className="text-gray-500">Category</span>
						<span className="text-gray-900 font-medium">
							{isLivestock
								? formData.livestockType || "-"
								: formData.cutType || "-"}
						</span>
					</div>
					{isLivestock && (
						<div className="flex justify-between py-2">
							<span className="text-gray-500">Breed</span>
							<span className="text-gray-900 font-medium">
								{formData.cutType || "-"}
							</span>
						</div>
					)}
					{isLivestock && (
						<div className="flex justify-between py-2">
							<span className="text-gray-500">Listing Type</span>
							<span className="text-gray-900 font-medium capitalize">
								{formData.listingType || "-"}
							</span>
						</div>
					)}
				{!isLivestock && (
					<>
						<div className="flex justify-between py-2">
							<span className="text-gray-500">Cut</span>
							<span className="text-gray-900 font-medium">
								{formData.cutType || "-"}
							</span>
						</div>
						{formData.processedCutType && (
							<div className="flex justify-between py-2">
								<span className="text-gray-500">Cut Type</span>
								<span className="text-gray-900 font-medium">
									{formData.processedCutType}
								</span>
							</div>
						)}
						<div className="flex justify-between py-2">
								<span className="text-gray-500">Unit Size</span>
								<span className="text-gray-900 font-medium">
									{formData.unitSize
										? `${formData.unitSize} ${formData.unitMeasure}`
										: "-"}
								</span>
							</div>
							<div className="flex justify-between py-2">
								<span className="text-gray-500">Storage</span>
								<span className="text-gray-900 font-medium">
									{formData.storageType || "fresh"}
								</span>
							</div>
						</>
					)}
					<div className="flex justify-between py-2">
						<span className="text-gray-500">Base Price (NGN)</span>
						<span className="text-gray-900 font-medium">
							{formatPrice(formData.basePrice)}
						</span>
					</div>
					<div className="flex justify-between py-2">
						<span className="text-gray-500">Description</span>
						<span className="text-gray-900 font-medium text-right max-w-xs">
							{formData.description || "Enter Description"}
						</span>
					</div>
				</div>
			</div>

			{/* Buttons */}
			<div className="flex flex-col sm:flex-row gap-4 mt-8">
				<button
					onClick={onBack}
					disabled={submitting}
					className="px-8 py-3.5 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition flex-1 sm:flex-none disabled:opacity-50"
				>
					Back
				</button>
				<button
					onClick={onCreate}
					disabled={submitting}
					className="px-8 py-3.5 bg-[#014834] text-white rounded-xl font-medium hover:bg-[#013824] transition flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{submitting ? (
						<span className="flex items-center gap-2">
							<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
							</svg>
							Creating...
						</span>
					) : (
						"Create"
					)}
				</button>
			</div>
			{error && (
				<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
					{error}
				</div>
			)}
		</div>
	);
};

export default ConfirmReview;
