"use client";

import React from "react";
import { Product } from "@/components/lib/supabase/database.types";
import { Box, MoreVertical, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductSummaryCardProps {
	product: Product;
}

const ProductSummaryCard = ({ product }: ProductSummaryCardProps) => {
	const router = useRouter();
	const isLivestock = product.product_type === "livestock";

	const formatPrice = (price: number) => {
		return `₦${price.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	};

	const getUnitLabel = () => {
		if (isLivestock) return "/ animal";
		if (product.unit_measure === "Kg") return "/ kg";
		if (product.unit_measure === "Pack") return "/ pack";
		return "/ head";
	};

	const getCategoryColor = () => {
		if (isLivestock) return "bg-green-500";
		return "bg-yellow-500";
	};

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const year = date.getFullYear().toString().slice(-2);
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		return `${day}.${month}.${year} ${hours}:${minutes} pm`;
	};

	return (
		<div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-5 mb-6">
			{/* Product Icon */}
			<div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
				{isLivestock ? (
					<svg viewBox="0 0 60 60" fill="none" className="w-12 h-12">
						<path
							d="M12 42c0 0 4-16 18-16s18 16 18 16"
							stroke="#1a1a1a"
							strokeWidth="2"
							fill="none"
						/>
						<circle cx="20" cy="26" r="2.5" fill="#1a1a1a" />
						<circle cx="40" cy="26" r="2.5" fill="#1a1a1a" />
						<ellipse cx="30" cy="34" rx="18" ry="10" stroke="#1a1a1a" strokeWidth="2" fill="none" />
					</svg>
				) : (
					<svg viewBox="0 0 60 60" fill="none" className="w-12 h-12">
						<ellipse cx="30" cy="34" rx="22" ry="14" stroke="#1a1a1a" strokeWidth="2" fill="none" />
						<path
							d="M12 28c0 0 8-16 18-16s18 16 18 16"
							stroke="#1a1a1a"
							strokeWidth="2"
							fill="none"
						/>
						<path d="M22 24c4 4 12 4 16 0" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
					</svg>
				)}
			</div>

			{/* Product Info */}
			<div className="flex-1 min-w-0">
				<h3 className="font-semibold text-gray-900 truncate">
					{product.product_name}
				</h3>
				<p className="text-[#014834] font-bold mt-0.5">
					{formatPrice(product.base_price)}
					<span className="font-normal text-gray-500 text-sm">{getUnitLabel()}</span>
				</p>
				<div className="flex items-center gap-3 mt-2">
					<span className="flex items-center gap-1.5 text-xs text-gray-600">
						<span className={`w-2 h-2 rounded-full ${getCategoryColor()}`} />
						{product.livestock_type || product.cut_type || "Product"}
					</span>
					<span className="flex items-center gap-1 text-xs text-gray-500">
						<Box className="w-3 h-3" />
						{product.listing_type === "individual" ? "1-of-1" : product.listing_type === "bulk" ? "Bulk" : "-"}
					</span>
				</div>
				<p className="text-xs text-gray-400 mt-2">
					3 inventory listings  Date: {formatDate(product.created_at)}
				</p>
			</div>

			{/* Actions */}
			<div className="flex items-center gap-2 flex-shrink-0">
				<button className="flex items-center gap-1.5 px-4 py-2.5 bg-[#014834] text-white rounded-xl text-sm font-medium hover:bg-[#013824] transition">
					<Plus className="w-4 h-4" />
					Add Stock
				</button>
				<button className="p-2.5 hover:bg-gray-100 rounded-xl transition">
					<MoreVertical className="w-5 h-5 text-gray-400" />
				</button>
			</div>
		</div>
	);
};

export default ProductSummaryCard;
