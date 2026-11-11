"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import ProductSummaryHeader from "./ProductSummaryHeader";
import InventoryTable from "./InventoryTable";
import { ConfirmDeleteModal, DeletedModal } from "@/app/dashboard/products/components/ProductModals";
import { getProducts, getToken } from "@/components/lib/supabase/auth";
import { Product, Inventory } from "@/components/lib/supabase/database.types";

interface StockListPageProps {
	productId: string;
}

const StockListPage = ({ productId }: StockListPageProps) => {
	const router = useRouter();
	const [product, setProduct] = useState<Product | null>(null);
	const [inventory, setInventory] = useState<Inventory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showDeletedModal, setShowDeletedModal] = useState(false);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		fetchData();
	}, [productId]);

	const fetchData = async () => {
		setLoading(true);
		setError(null);

		// Fetch product
		const productResult = await getProducts();
		if (productResult.success && productResult.products) {
			const found = productResult.products.find((p) => p.id === productId);
			if (found) {
				setProduct(found);
			} else {
				setError("Product not found");
				setLoading(false);
				return;
			}
		} else {
			setError(productResult.error || "Failed to load product");
			setLoading(false);
			return;
		}

		// Fetch inventory
		const token = getToken();
		if (token) {
			const res = await fetch(`/api/inventory?productId=${productId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			if (res.ok && data.inventory) {
				setInventory(data.inventory.filter((i: Inventory) => i.status !== "archived"));
			}
		}

		setLoading(false);
	};

	const handleAddStock = () => {
		router.push(`/dashboard/products/add-inventory/${productId}`);
	};

	const handleEdit = () => {
		router.push(`/dashboard/products/edit/${productId}`);
	};

	const handleDelete = async () => {
		setDeleting(true);
		const token = getToken();
		if (!token) return;

		const res = await fetch(`/api/products/${productId}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.ok) {
			setShowDeleteModal(false);
			setShowDeletedModal(true);
		} else {
			const data = await res.json();
			alert(data.error || "Failed to delete product");
		}
		setDeleting(false);
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
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M19 12H5M12 19l-7-7 7-7" />
							</svg>
							Go Back
						</button>
						<span>/</span>
						<button onClick={() => router.push("/dashboard")} className="hover:text-gray-700 transition">
							Dashboard
						</button>
						<span>/</span>
						<span className="text-gray-900 font-medium">Stock List</span>
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
							<button onClick={() => router.back()} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition">
								Go Back
							</button>
						</div>
					)}

					{/* Content */}
					{!loading && !error && product && (
						<>
						<ProductSummaryHeader
							product={product}
							inventoryCount={inventory.length}
							onAddStock={handleAddStock}
							onEdit={handleEdit}
							onDelete={() => setShowDeleteModal(true)}
						/>
						<InventoryTable
							inventory={inventory}
							onInventoryChange={(updated) =>
								setInventory((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
							}
							onInventoryRemove={(id) =>
								setInventory((prev) => prev.filter((i) => i.id !== id))
							}
						/>

						<ConfirmDeleteModal
							open={showDeleteModal}
							loading={deleting}
							onCancel={() => setShowDeleteModal(false)}
							onConfirm={handleDelete}
						/>
						<DeletedModal
							open={showDeletedModal}
						/>
						</>
					)}
				</div>
			</DashboardLayout>
		</AuthGuard>
	);
};

export default StockListPage;
