"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { getToken } from "@/components/lib/supabase/auth";
import { addNotification } from "@/components/lib/notifications";
import { Product } from "@/components/lib/supabase/database.types";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmSubmitModal, ConfirmDeleteModal, SubmittedModal, DeletedModal } from "../../../components/ProductModals";

interface ViewProductPageProps {
	productId: string;
}

const ViewProductPage = ({ productId }: ViewProductPageProps) => {
	const router = useRouter();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [submitModal, setSubmitModal] = useState({ open: false, loading: false });
	const [deleteModal, setDeleteModal] = useState({ open: false, loading: false });
	const [submitted, setSubmitted] = useState(false);
	const [deleted, setDeleted] = useState(false);

	useEffect(() => {
		fetchProduct();
	}, [productId]);

	const fetchProduct = async () => {
		setLoading(true);
		const token = getToken();
		if (!token) {
			setError("Not authenticated");
			setLoading(false);
			return;
		}
		try {
			const res = await fetch(`/api/products/${productId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			if (res.ok && data.product) {
				setProduct(data.product);
			} else {
				setError(data.error || "Product not found");
			}
		} catch {
			setError("Failed to load product");
		}
		setLoading(false);
	};

	const handleSubmitForApproval = async () => {
		setSubmitModal({ open: true, loading: true });
		const token = getToken();
		try {
			const res = await fetch(`/api/products/${productId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ status: "pending" }),
			});
			if (res.ok) {
				setSubmitModal({ open: false, loading: false });
				setSubmitted(true);
				addNotification({
					title: "Product submitted for approval",
					message: "Your product has been submitted and is awaiting admin review.",
					type: "info",
					link: "/dashboard/products/pending",
				});
			} else {
				setSubmitModal({ open: false, loading: false });
			}
		} catch {
			setSubmitModal({ open: false, loading: false });
		}
	};

	const handleDelete = async () => {
		setDeleteModal({ open: true, loading: true });
		const token = getToken();
		try {
			const res = await fetch(`/api/products/${productId}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.ok) {
				setDeleteModal({ open: false, loading: false });
				setDeleted(true);
			} else {
				setDeleteModal({ open: false, loading: false });
			}
		} catch {
			setDeleteModal({ open: false, loading: false });
		}
	};

	const formatPrice = (price: number) =>
		`₦${price.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const year = date.getFullYear().toString().slice(-2);
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		return `${day}.${month}.${year} ${hours}:${minutes} pm`;
	};

	const isLivestock = product?.product_type === "livestock";
	const speciesLabel = isLivestock ? "Livestock Type(Species)" : "Product Type";
	const speciesValue = product?.livestock_type || product?.cut_type || "-";

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
						<button onClick={() => router.push("/dashboard/products/drafts")} className="hover:text-gray-700 transition">
							Livestock Summary
						</button>
						<span>/</span>
						<span className="text-gray-900 font-medium">Livestock ID: {productId.slice(0, 6)}</span>
						<span>/</span>
						<span className="text-gray-900 font-medium">Preview</span>
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
						<div className="mb-6">
							<h1 className="text-2xl font-bold text-gray-900">
								View Listing {isLivestock ? "Livestock" : "Product"}
							</h1>
						</div>

							{/* Product Summary Card */}
							<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
								<div className="flex items-start justify-between mb-6">
									<div>
										<h2 className="text-lg font-bold text-gray-900">{speciesValue}</h2>
										<p className="text-xs text-gray-400 mt-0.5">
											Livestock ID: {product.id.slice(0, 6)}
											<span className="ml-3 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
												{product.status}
											</span>
										</p>
									</div>
									<div className="flex items-center gap-2">
										<button
											onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}
											className="flex items-center gap-1.5 px-4 py-2 border-2 border-gray-300 rounded-xl text-sm text-gray-900 font-bold hover:bg-gray-100 transition"
										>
											<Pencil className="w-4 h-4" />
											Edit
										</button>
										<button
											onClick={() => setDeleteModal({ open: true, loading: false })}
											className="flex items-center gap-1.5 px-4 py-2 border border-red-200 rounded-xl text-sm text-red-600 font-semibold hover:bg-red-50 transition"
										>
											<Trash2 className="w-4 h-4" />
											Delete
										</button>
									</div>
								</div>

								{/* Details Grid */}
								<div className="grid grid-cols-2 md:grid-cols-5 gap-6 py-5 border-t border-gray-100">
									<div>
										<p className="text-xs text-gray-400 mb-1">{speciesLabel}</p>
										<p className="text-sm font-medium text-gray-900">{speciesValue}</p>
									</div>
									<div>
										<p className="text-xs text-gray-400 mb-1">Breed</p>
										<p className="text-sm font-medium text-gray-900">{product.product_name || "-"}</p>
									</div>
									<div>
										<p className="text-xs text-gray-400 mb-1">HS Code</p>
										<p className="text-sm font-medium text-gray-900">{product.hs_code || "-"}</p>
									</div>
									<div>
										<p className="text-xs text-gray-400 mb-1">Weight (kg)</p>
										<p className="text-sm font-medium text-gray-900">
											{product.unit_size ? `${product.unit_size}kg` : "-"}
										</p>
									</div>
									<div>
										<p className="text-xs text-gray-400 mb-1">Pricing (NGN)</p>
										<p className="text-sm font-medium text-gray-900">{formatPrice(product.base_price)}</p>
									</div>
								</div>

								{/* Description */}
								<div className="py-5 border-t border-gray-100">
									<p className="text-xs text-gray-400 mb-1">Description</p>
									<p className="text-sm text-gray-700">{product.description || "-"}</p>
								</div>

								{/* Meta Grid */}
								<div className="grid grid-cols-2 md:grid-cols-5 gap-6 py-5 border-t border-gray-100">
									<div>
										<p className="text-xs text-gray-400 mb-1">Quantity Sold</p>
										<p className="text-sm font-medium text-gray-900">14</p>
									</div>
									<div>
										<p className="text-xs text-gray-400 mb-1">Tags</p>
										<p className="text-sm font-medium text-gray-900">483</p>
									</div>
									<div>
										<p className="text-xs text-gray-400 mb-1">Location</p>
										<p className="text-sm font-medium text-gray-900">Lagos, Nigeria</p>
									</div>
									<div>
										<p className="text-xs text-gray-400 mb-1">Status</p>
										<p className="text-sm font-medium text-gray-900 capitalize">{product.status}</p>
									</div>
									<div>
										<p className="text-xs text-gray-400 mb-1">Last updated on</p>
										<p className="text-sm font-medium text-gray-900">{formatDate(product.updated_at)}</p>
									</div>
								</div>

								{/* Media Grid */}
								<div className="grid grid-cols-2 md:grid-cols-5 gap-6 py-5 border-t border-gray-100">
									<div>
										<p className="text-xs text-gray-400 mb-1">Images</p>
										<p className="text-sm font-medium text-gray-900">5 pngs</p>
									</div>
									<div>
										<p className="text-xs text-gray-400 mb-1">Documents</p>
										<p className="text-sm font-medium text-gray-900">5</p>
									</div>
								</div>
							</div>

							{/* Submit Button */}
							<div className="flex justify-end">
								<button
									onClick={() => setSubmitModal({ open: true, loading: false })}
									className="px-6 py-3 bg-[#014834] text-white rounded-xl font-medium hover:bg-[#013824] transition"
								>
									Submit for Approval
								</button>
							</div>
						</>
					)}
				</div>

				{/* Modals */}
				<ConfirmSubmitModal
					open={submitModal.open}
					loading={submitModal.loading}
					onCancel={() => setSubmitModal({ open: false, loading: false })}
					onConfirm={handleSubmitForApproval}
				/>
				<ConfirmDeleteModal
					open={deleteModal.open}
					loading={deleteModal.loading}
					onCancel={() => setDeleteModal({ open: false, loading: false })}
					onConfirm={handleDelete}
				/>
				<SubmittedModal open={submitted} />
				<DeletedModal open={deleted} />
			</DashboardLayout>
		</AuthGuard>
	);
};

export default ViewProductPage;
