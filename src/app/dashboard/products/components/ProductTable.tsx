"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/components/lib/supabase/database.types";
import { Box, Package, MoreVertical, Edit3, Trash2, Send, XCircle, Eye, ArrowDownToLine, Clock, RefreshCw, Archive } from "lucide-react";

interface ProductTableProps {
	products: Product[];
	onAction?: (action: string, product: Product) => void;
	loading?: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onAction, loading }) => {
	const router = useRouter();
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (!(e.target as HTMLElement).closest("[data-product-menu]")) {
				setOpenMenuId(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const formatPrice = (price: number) => {
		return `₦${price.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "draft": return "bg-gray-100 text-gray-600";
			case "pending": return "bg-yellow-100 text-yellow-700";
			case "published": return "bg-green-100 text-green-700";
			case "sold": return "bg-red-100 text-red-600";
			default: return "bg-gray-100 text-gray-600";
		}
	};

	const getListingTypeLabel = (product: Product) => {
		if (product.product_type === "livestock") return product.listing_type === "individual" ? "1-of-1" : "Bulk";
		return product.listing_type === "individual" ? "1-of-1" : "Bulk";
	};

	const getMenuActions = (status: string) => {
		switch (status) {
			case "draft":
				return [
					{ key: "edit", label: "Edit", icon: Edit3, color: "text-gray-700" },
					{ key: "delete", label: "Delete", icon: Trash2, color: "text-red-500" },
					{ key: "submit", label: "Submit for Approval", icon: Send, color: "text-[#014834]" },
				];
			case "pending":
				return [
					{ key: "edit", label: "Edit", icon: Edit3, color: "text-gray-700" },
					{ key: "delete", label: "Delete", icon: Trash2, color: "text-red-500" },
					{ key: "withdraw", label: "Withdraw from Review", icon: XCircle, color: "text-yellow-600" },
				];
			case "published":
				return [
					{ key: "edit", label: "Edit", icon: Edit3, color: "text-gray-700" },
					{ key: "delist", label: "Delist", icon: ArrowDownToLine, color: "text-orange-600" },
				];
			case "sold":
				return [
					{ key: "view", label: "View Details", icon: Eye, color: "text-gray-700" },
					{ key: "relist", label: "Relist", icon: RefreshCw, color: "text-green-600" },
					{ key: "archive", label: "Archive", icon: Archive, color: "text-orange-600" },
				];
			default:
				return [];
		}
	};

	const handleAction = (action: string, product: Product) => {
		setOpenMenuId(null);
		if (onAction) {
			onAction(action, product);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-20">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#014834]" />
			</div>
		);
	}

	if (products.length === 0) {
		return null;
	}

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
			<table className="w-full">
				<thead>
					<tr className="border-b border-gray-100">
						<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
						<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Listing Type</th>
						<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
						<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
						<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Created</th>
						<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
					</tr>
				</thead>
				<tbody>
					{products.map((product) => (
						<tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
							<td className="p-4">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
										{product.product_type === "livestock" ? (
											<svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
												<path d="M4 18c0 0 2-8 8-8s8 8 8 8" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
												<circle cx="8" cy="12" r="1" fill="#1a1a1a" />
												<circle cx="16" cy="12" r="1" fill="#1a1a1a" />
											</svg>
										) : (
											<Package className="w-5 h-5 text-gray-400" />
										)}
									</div>
									<div>
										<p className="font-medium text-gray-900 text-sm">{product.product_name}</p>
										<p className="text-xs text-gray-500">{product.livestock_type || product.cut_type}</p>
									</div>
								</div>
							</td>
							<td className="p-4">
								<span className="flex items-center gap-1.5 text-sm text-gray-600">
									<Box className="w-3.5 h-3.5" />
									{getListingTypeLabel(product)}
								</span>
							</td>
							<td className="p-4 text-sm font-medium text-[#014834]">
								{formatPrice(product.base_price)}
							</td>
							<td className="p-4">
								<span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(product.status)}`}>
									{product.status}
								</span>
							</td>
							<td className="p-4 text-sm text-gray-500">
								{new Date(product.created_at).toLocaleDateString()}
							</td>
							<td className="p-4">
								<div data-product-menu className="relative">
									<button
										onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
										className="p-2 hover:bg-gray-100 rounded-lg transition"
									>
										<MoreVertical className="w-4 h-4 text-gray-500" />
									</button>
									{openMenuId === product.id && (
										<div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 min-w-[200px]">
											{getMenuActions(product.status).map((item) => (
												<button
													key={item.key}
													onClick={() => handleAction(item.key, product)}
													className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-50 transition text-left"
												>
													<item.icon className={`w-4 h-4 ${item.color}`} />
													<span className={item.color}>{item.label}</span>
												</button>
											))}
										</div>
									)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ProductTable;
