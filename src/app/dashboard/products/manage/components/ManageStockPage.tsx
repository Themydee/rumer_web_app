"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { getProducts, getToken } from "@/components/lib/supabase/auth";
import { Product } from "@/components/lib/supabase/database.types";
import { Box, Plus, Eye, Package, MoreVertical, Eye as ViewIcon, Edit3, Trash2, X } from "lucide-react";

const ManageStockPage = () => {
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const [confirmModal, setConfirmModal] = useState<{
		open: boolean;
		product: Product | null;
		loading: boolean;
	}>({ open: false, product: null, loading: false });

	useEffect(() => {
		fetchProducts();
	}, []);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (!(e.target as HTMLElement).closest("[data-product-menu]")) {
				setOpenMenuId(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const fetchProducts = async () => {
		setLoading(true);
		const result = await getProducts();
		if (result.success && result.products) {
			setProducts(result.products);
		}
		setLoading(false);
	};

	const handleDelete = async () => {
		const { product } = confirmModal;
		if (!product) return;

		setConfirmModal((prev) => ({ ...prev, loading: true }));
		const token = getToken();
		try {
			const res = await fetch(`/api/products/${product.id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.ok) {
				setProducts((prev) => prev.filter((p) => p.id !== product.id));
			}
		} catch {
			// silent
		}
		setConfirmModal({ open: false, product: null, loading: false });
	};

	const formatPrice = (price: number) => {
		return `₦${price.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	};

	const getUnitLabel = (product: Product) => {
		if (product.product_type === "livestock") return "/ animal";
		if (product.unit_measure === "Kg") return "/ kg";
		if (product.unit_measure === "Pack") return "/ pack";
		return "/ head";
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

	return (
		<AuthGuard>
			<DashboardLayout>
				<div className="flex-1 p-6 lg:p-8 bg-gray-50/50 min-h-screen">
					{/* Breadcrumb */}
					<div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
						<button onClick={() => router.back()} className="flex items-center gap-1 hover:text-gray-700 transition">
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
						<span className="text-gray-900 font-medium">Manage Stock</span>
					</div>

					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-xl font-bold text-gray-900">Manage Stock</h1>
						<button
							onClick={() => router.push("/dashboard/products/add")}
							className="flex items-center gap-2 px-5 py-2.5 bg-[#014834] text-white rounded-xl font-medium hover:bg-[#013824] transition"
						>
							<Plus className="w-4 h-4" />
							Add Product
						</button>
					</div>

					{/* Loading */}
					{loading && (
						<div className="flex items-center justify-center py-20">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#014834]" />
						</div>
					)}

					{/* Empty */}
					{!loading && products.length === 0 && (
						<div className="flex flex-col items-center justify-center py-20">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
								<Package className="w-8 h-8 text-gray-400" />
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-1">No products yet</h3>
							<p className="text-gray-500 mb-4">Create your first product to start managing stock</p>
							<button
								onClick={() => router.push("/dashboard/products/add")}
								className="flex items-center gap-2 px-5 py-2.5 bg-[#014834] text-white rounded-xl font-medium hover:bg-[#013824] transition"
							>
								<Plus className="w-4 h-4" />
								Add Product
							</button>
						</div>
					)}

					{/* Products Table */}
					{!loading && products.length > 0 && (
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-100">
										<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
										<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
										<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
										<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
										<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
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
													{product.listing_type === "individual" ? "1-of-1" : product.listing_type === "bulk" ? "Bulk" : "-"}
												</span>
											</td>
											<td className="p-4 text-sm font-medium text-[#014834]">
												{formatPrice(product.base_price)}
												<span className="font-normal text-gray-500 text-xs">{getUnitLabel(product)}</span>
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
												<div className="flex items-center gap-2">
													<button
														onClick={() => router.push(`/dashboard/products/stock/${product.id}`)}
														className="flex items-center gap-1.5 px-3 py-1.5 bg-[#014834] text-white rounded-lg text-xs font-medium hover:bg-[#013824] transition"
													>
														<Eye className="w-3.5 h-3.5" />
														View Stock
													</button>
													<div data-product-menu className="relative">
														<button
															onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
															className="p-1.5 hover:bg-gray-100 rounded-lg transition"
														>
															<MoreVertical className="w-4 h-4 text-gray-500" />
														</button>
													{openMenuId === product.id && (
														<div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 min-w-[165px]">
															<button
																onClick={() => {
																	setOpenMenuId(null);
																	router.push(`/dashboard/products/view/${product.id}`);
																}}
																className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-900 font-semibold hover:bg-gray-100 transition text-left"
															>
																<ViewIcon className="w-4 h-4 text-gray-700" />
																View Details
															</button>
															<button
																onClick={() => {
																	setOpenMenuId(null);
																	router.push(`/dashboard/products/edit/${product.id}`);
																}}
																className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-900 font-semibold hover:bg-gray-100 transition text-left"
															>
																<Edit3 className="w-4 h-4 text-gray-700" />
																Edit Details
															</button>
															<button
																onClick={() => {
																	setOpenMenuId(null);
																	setConfirmModal({ open: true, product, loading: false });
																}}
																className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 font-semibold hover:bg-red-50 transition text-left"
																>
																<Trash2 className="w-4 h-4" />
																Delete
															</button>
														</div>
													)}
													</div>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{/* Confirm Delete Modal */}
					{confirmModal.open && confirmModal.product && (
						<div className="fixed inset-0 z-50 flex items-center justify-center">
							<div className="absolute inset-0 bg-black/40" onClick={() => !confirmModal.loading && setConfirmModal({ open: false, product: null, loading: false })} />
							<div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
								<button
									onClick={() => !confirmModal.loading && setConfirmModal({ open: false, product: null, loading: false })}
									className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg"
								>
									<X className="w-5 h-5 text-gray-400" />
								</button>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Product</h3>
								<p className="text-sm text-gray-600 mb-6">
									Are you sure you want to delete &quot;{confirmModal.product.product_name}&quot;? This action cannot be undone.
								</p>
								<div className="flex gap-3 justify-end">
									<button
										onClick={() => setConfirmModal({ open: false, product: null, loading: false })}
										disabled={confirmModal.loading}
										className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
									>
										Cancel
									</button>
									<button
										onClick={handleDelete}
										disabled={confirmModal.loading}
										className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50"
									>
										{confirmModal.loading ? "Deleting..." : "Delete"}
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</DashboardLayout>
		</AuthGuard>
	);
};

export default ManageStockPage;
