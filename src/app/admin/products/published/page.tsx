"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Eye, Archive } from "lucide-react";
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
	created_at: string;
	profiles?: {
		first_name: string | null;
		last_name: string | null;
		farm_name: string | null;
	};
}

export default function PublishedProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const token = getToken();
			const res = await fetch("/api/admin/products?status=published", {
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

	const handleDelist = async (productId: string) => {
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
			}
		} catch (error) {
			console.error("Failed to delist product:", error);
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
				<h2 className="text-2xl font-bold text-gray-900">Published Products</h2>
				<p className="text-gray-500 mt-1">
					Products currently visible on the marketplace
				</p>
			</div>

			{products.length === 0 ? (
				<div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
					<p className="text-gray-500">No published products yet.</p>
				</div>
			) : (
				<div className="grid gap-4">
					{products.map((product) => (
						<div
							key={product.id}
							className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
						>
							<div className="flex flex-col lg:flex-row lg:items-center gap-4">
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
								</div>

								<div className="lg:text-right">
									<p className="text-lg font-bold text-[#014834]">
										{formatNaira(product.base_price)}
									</p>
								</div>

								<div className="flex items-center gap-2">
									<a
										href={`/marketplace/product/${product.id}`}
										target="_blank"
										rel="noopener noreferrer"
										className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
										title="View on Marketplace"
									>
										<Eye className="w-5 h-5 text-gray-600" />
									</a>
									<button
										onClick={() => handleDelist(product.id)}
										className="flex items-center gap-2 px-4 py-2 border-2 border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition"
									>
										<Archive className="w-4 h-4" />
										Delist
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
