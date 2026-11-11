"use client";

import React, { useState, useEffect } from "react";
import { Check, X, Eye, Loader2 } from "lucide-react";
import { formatNaira } from "@/components/lib/marketplace/cart";
import { getToken } from "@/components/lib/supabase/auth";

interface Product {
	id: string;
	product_name: string;
	product_type: string;
	livestock_type: string | null;
	base_price: number;
	status: string;
	images: string[];
	description: string | null;
	created_at: string;
	profiles?: {
		first_name: string | null;
		last_name: string | null;
		farm_name: string | null;
		email: string | null;
	};
}

export default function PendingProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const token = getToken();
			const res = await fetch("/api/admin/products?status=pending", {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			if (data.success) {
				setProducts(data.products);
			}
		} catch (error) {
			console.error("Failed to fetch products:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleApprove = async (productId: string) => {
		setActionLoading(productId);
		try {
			const token = getToken();
			const res = await fetch(`/api/admin/products/${productId}/approve`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ status: "published" }),
			});
			if (res.ok) {
				setProducts((prev) => prev.filter((p) => p.id !== productId));
				setSelectedProduct(null);
			}
		} catch (error) {
			console.error("Failed to approve product:", error);
		} finally {
			setActionLoading(null);
		}
	};

	const handleReject = async (productId: string) => {
		setActionLoading(productId);
		try {
			const token = getToken();
			const res = await fetch(`/api/admin/products/${productId}/approve`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ status: "draft" }),
			});
			if (res.ok) {
				setProducts((prev) => prev.filter((p) => p.id !== productId));
				setSelectedProduct(null);
			}
		} catch (error) {
			console.error("Failed to reject product:", error);
		} finally {
			setActionLoading(null);
		}
	};

	const getSellerName = (product: Product) => {
		if (product.profiles?.farm_name) return product.profiles.farm_name;
		const first = product.profiles?.first_name || "";
		const last = product.profiles?.last_name || "";
		return `${first} ${last}`.trim() || "Unknown Seller";
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="w-8 h-8 animate-spin text-[#014834]" />
			</div>
		);
	}

	return (
		<div>
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-900">Pending Approval</h2>
				<p className="text-gray-500 mt-1">
					Review and approve products submitted by traders
				</p>
			</div>

			{products.length === 0 ? (
				<div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
					<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Check className="w-8 h-8 text-green-600" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						All caught up!
					</h3>
					<p className="text-gray-500">
						No products pending approval at this time.
					</p>
				</div>
			) : (
				<div className="grid gap-4">
					{products.map((product) => (
						<div
							key={product.id}
							className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
						>
							<div className="flex flex-col lg:flex-row lg:items-center gap-4">
								{/* Product Image */}
								<div className="w-full lg:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
									{product.images && product.images.length > 0 ? (
										<img
											src={product.images[0]}
											alt={product.product_name}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
											No Image
										</div>
									)}
								</div>

								{/* Product Info */}
								<div className="flex-1 min-w-0">
									<h3 className="font-semibold text-gray-900 truncate">
										{product.product_name}
									</h3>
									<p className="text-sm text-gray-500 mt-1">
										{product.product_type === "livestock"
											? product.livestock_type || "Livestock"
											: "Processed Product"}
									</p>
									<p className="text-sm text-gray-500">
										Seller: {getSellerName(product)}
									</p>
									<p className="text-sm text-gray-400 mt-1">
										Submitted:{" "}
										{new Date(product.created_at).toLocaleDateString()}
									</p>
								</div>

								{/* Price */}
								<div className="lg:text-right">
									<p className="text-lg font-bold text-[#014834]">
										{formatNaira(product.base_price)}
									</p>
								</div>

								{/* Actions */}
								<div className="flex items-center gap-2">
									<button
										onClick={() => setSelectedProduct(product)}
										className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
										title="View Details"
									>
										<Eye className="w-5 h-5 text-gray-600" />
									</button>
									<button
										onClick={() => handleApprove(product.id)}
										disabled={actionLoading === product.id}
										className="flex items-center gap-2 px-4 py-2 bg-[#014834] text-white rounded-lg hover:bg-[#013824] transition disabled:opacity-50"
									>
										{actionLoading === product.id ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											<Check className="w-4 h-4" />
										)}
										Approve
									</button>
									<button
										onClick={() => handleReject(product.id)}
										disabled={actionLoading === product.id}
										className="flex items-center gap-2 px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
									>
										<X className="w-4 h-4" />
										Reject
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Product Detail Modal */}
			{selectedProduct && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-bold text-gray-900">
									{selectedProduct.product_name}
								</h3>
								<button
									onClick={() => setSelectedProduct(null)}
									className="p-2 hover:bg-gray-100 rounded-lg transition"
								>
									<X className="w-5 h-5" />
								</button>
							</div>

							{selectedProduct.images && selectedProduct.images.length > 0 && (
								<div className="mb-4">
									<img
										src={selectedProduct.images[0]}
										alt={selectedProduct.product_name}
										className="w-full h-64 object-cover rounded-lg"
									/>
								</div>
							)}

							<div className="space-y-3">
								<div>
									<span className="text-sm text-gray-500">Type:</span>
									<span className="ml-2 text-gray-900">
										{selectedProduct.product_type === "livestock"
											? selectedProduct.livestock_type || "Livestock"
											: "Processed Product"}
									</span>
								</div>
								<div>
									<span className="text-sm text-gray-500">Price:</span>
									<span className="ml-2 text-gray-900 font-bold">
										{formatNaira(selectedProduct.base_price)}
									</span>
								</div>
								<div>
									<span className="text-sm text-gray-500">Seller:</span>
									<span className="ml-2 text-gray-900">
										{getSellerName(selectedProduct)}
									</span>
								</div>
								{selectedProduct.description && (
									<div>
										<span className="text-sm text-gray-500">Description:</span>
										<p className="mt-1 text-gray-900">
											{selectedProduct.description}
										</p>
									</div>
								)}
							</div>

							<div className="flex gap-3 mt-6">
								<button
									onClick={() => handleApprove(selectedProduct.id)}
									disabled={actionLoading === selectedProduct.id}
									className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#014834] text-white rounded-lg hover:bg-[#013824] transition disabled:opacity-50"
								>
									{actionLoading === selectedProduct.id ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										<Check className="w-5 h-5" />
									)}
									Approve
								</button>
								<button
									onClick={() => handleReject(selectedProduct.id)}
									disabled={actionLoading === selectedProduct.id}
									className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
								>
									<X className="w-5 h-5" />
									Reject
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
