"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import ProductSummaryCard from "./ProductSummaryCard";
import InventoryDetailsForm from "./InventoryDetailsForm";
import { getProducts } from "@/components/lib/supabase/auth";
import { Product } from "@/components/lib/supabase/database.types";

interface AddInventoryPageProps {
	productId: string;
}

const AddInventoryPage = ({ productId }: AddInventoryPageProps) => {
	const router = useRouter();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchProduct();
	}, [productId]);

	const fetchProduct = async () => {
		setLoading(true);
		const result = await getProducts();
		if (result.success && result.products) {
			const found = result.products.find((p) => p.id === productId);
			if (found) {
				setProduct(found);
			} else {
				setError("Product not found");
			}
		} else {
			setError(result.error || "Failed to load product");
		}
		setLoading(false);
	};

	return (
		<AuthGuard>
			<DashboardLayout>
				<div className="flex-1 p-6 lg:p-8 bg-gray-50/50 min-h-screen">
					{/* Breadcrumb */}
					<div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
						<button
							onClick={() => router.back()}
							className="flex items-center gap-1 hover:text-gray-700 transition"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M19 12H5M12 19l-7-7 7-7" />
							</svg>
							Go Back
						</button>
						<span>/</span>
						<button
							onClick={() => router.push("/dashboard")}
							className="hover:text-gray-700 transition"
						>
							Dashboard
						</button>
						<span>/</span>
						<span className="text-gray-900 font-medium">Add Inventory</span>
					</div>

					{/* Loading */}
					{loading && (
						<div className="flex items-center justify-center py-20">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#014834]" />
						</div>
					)}

					{/* Error */}
					{error && !loading && (
						<div className="text-center py-20">
							<p className="text-red-600 mb-4">{error}</p>
							<button
								onClick={() => router.back()}
								className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition"
							>
								Go Back
							</button>
						</div>
					)}

					{/* Content */}
					{!loading && !error && product && (
						<>
							{/* Product Summary */}
							<ProductSummaryCard product={product} />

							{/* Inventory Form */}
							<InventoryDetailsForm product={product} />
						</>
					)}
				</div>
			</DashboardLayout>
		</AuthGuard>
	);
};

export default AddInventoryPage;
