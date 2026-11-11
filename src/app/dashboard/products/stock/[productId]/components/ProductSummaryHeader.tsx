"use client";

import React from "react";
import { Product } from "@/components/lib/supabase/database.types";
import { Box, Plus, Pencil, Trash2 } from "lucide-react";

interface ProductSummaryHeaderProps {
	product: Product;
	inventoryCount: number;
	onAddStock: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

const ProductSummaryHeader = ({
	product,
	inventoryCount,
	onAddStock,
	onEdit,
	onDelete,
}: ProductSummaryHeaderProps) => {
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
		<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
			<div className="flex items-center gap-5">
				{/* Product Icon */}
				<div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
					{isLivestock ? (
						<svg viewBox="0 0 60 60" fill="none" className="w-12 h-12">
							<path d="M12 42c0 0 4-16 18-16s18 16 18 16" stroke="#1a1a1a" strokeWidth="2" fill="none" />
							<circle cx="20" cy="26" r="2.5" fill="#1a1a1a" />
							<circle cx="40" cy="26" r="2.5" fill="#1a1a1a" />
							<ellipse cx="30" cy="34" rx="18" ry="10" stroke="#1a1a1a" strokeWidth="2" fill="none" />
						</svg>
					) : (
						<svg viewBox="0 0 60 60" fill="none" className="w-12 h-12">
							<ellipse cx="30" cy="34" rx="22" ry="14" stroke="#1a1a1a" strokeWidth="2" fill="none" />
							<path d="M12 28c0 0 8-16 18-16s18 16 18 16" stroke="#1a1a1a" strokeWidth="2" fill="none" />
							<path d="M22 24c4 4 12 4 16 0" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
						</svg>
					)}
				</div>

				{/* Product Info */}
				<div className="flex-1 min-w-0">
					<h2 className="text-xl font-bold text-gray-900">{product.product_name}</h2>
					<div className="flex items-center gap-3 mt-1">
						<span className="flex items-center gap-1.5 text-sm text-gray-600">
							<span className={`w-2 h-2 rounded-full ${getCategoryColor()}`} />
							{product.livestock_type || product.cut_type || "Product"}
						</span>
						<span className="flex items-center gap-1 text-sm text-gray-500">
							<Box className="w-3.5 h-3.5" />
							{product.listing_type === "individual" ? "1-of-1" : product.listing_type === "bulk" ? "Bulk" : "-"}
						</span>
					</div>
					<p className="text-sm text-gray-400 mt-1">
						{inventoryCount} inventory listings  Date: {formatDate(product.created_at)}
					</p>
					<div className="flex items-center gap-3 mt-2">
						<p className="text-[#014834] font-bold">
							{formatPrice(product.base_price)}
							<span className="font-normal text-gray-500 text-sm">{getUnitLabel()}</span>
						</p>
						<span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
							{product.status}
						</span>
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3 flex-shrink-0">
					<button
						onClick={onAddStock}
						className="flex items-center gap-1.5 px-5 py-2.5 bg-[#014834] text-white rounded-xl font-medium hover:bg-[#013824] transition"
					>
						<Plus className="w-4 h-4" />
						Add Stock
					</button>
				<button
					onClick={onEdit}
					className="flex items-center gap-1.5 px-4 py-2.5 border-2 border-gray-300 rounded-xl text-gray-900 font-bold hover:bg-gray-100 transition"
				>
					<Pencil className="w-4 h-4" />
					Edit
				</button>
					<button
						onClick={onDelete}
						className="flex items-center gap-1.5 px-4 py-2.5 border border-red-200 rounded-xl text-red-600 font-medium hover:bg-red-50 transition"
					>
						<Trash2 className="w-4 h-4" />
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductSummaryHeader;
