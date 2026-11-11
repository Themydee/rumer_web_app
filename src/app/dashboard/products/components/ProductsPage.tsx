"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import FilterTabs from "./FilterTabs";
import ProductCard from "./ProductCard";
import ProductTable from "./ProductTable";
import { ConfirmSubmitModal, ConfirmDeleteModal, SubmittedModal, DeletedModal } from "./ProductModals";
import { getProducts, getToken } from "@/components/lib/supabase/auth";
import { Product } from "@/components/lib/supabase/database.types";
import { Grid3X3, Plus, Database, AlertTriangle, X } from "lucide-react";

const MIGRATION_SQL = `-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New query):
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_type TEXT NOT NULL CHECK (product_type IN ('livestock', 'processed')),
    listing_type TEXT CHECK (listing_type IN ('individual', 'bulk')),
    product_name TEXT NOT NULL,
    livestock_type TEXT,
    cut_type TEXT,
    unit_size NUMERIC,
    unit_measure TEXT CHECK (unit_measure IN ('Kg', 'Pack')),
    storage_type TEXT,
    hs_code TEXT,
    base_price NUMERIC NOT NULL DEFAULT 0,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'sold')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_products_owner_id ON products(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);`;

interface ProductsPageProps {
	defaultFilter?: "all" | "livestock" | "processed";
	statusFilter?: string;
}

const ProductsPage = ({ defaultFilter = "all", statusFilter }: ProductsPageProps) => {
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeFilter, setActiveFilter] = useState<"all" | "livestock" | "processed">(defaultFilter);
	const [tableMissing, setTableMissing] = useState(false);
	const [setupLoading, setSetupLoading] = useState(false);
	const [setupResult, setSetupResult] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		setLoading(true);
		setTableMissing(false);
		const result = await getProducts(statusFilter);
		if (result.success && result.products) {
			setProducts(result.products);
		} else if (result.error?.includes("Products table not found") || result.error?.includes("does not exist")) {
			setTableMissing(true);
		}
		setLoading(false);
	};

	const handleAutoSetup = async () => {
		setSetupLoading(true);
		setSetupResult(null);
		try {
			const token = getToken();
			const res = await fetch("/api/products/setup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await res.json();
			if (res.ok) {
				setSetupResult("Table created! Refreshing...");
				setTimeout(() => {
					setTableMissing(false);
					fetchProducts();
				}, 1500);
			} else {
				setSetupResult(data.error || "Setup failed. Please run the SQL manually.");
			}
		} catch {
			setSetupResult("Auto-setup not available. Please run the SQL manually.");
		}
		setSetupLoading(false);
	};

	const handleCopySql = async () => {
		await navigator.clipboard.writeText(MIGRATION_SQL);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const [confirmModal, setConfirmModal] = useState<{
		open: boolean;
		action: string;
		product: Product | null;
		loading: boolean;
	}>({ open: false, action: "", product: null, loading: false });
	const [submitted, setSubmitted] = useState(false);
	const [deleted, setDeleted] = useState(false);

	const filteredProducts = products.filter((p) => {
		if (activeFilter === "all") return true;
		return p.product_type === activeFilter;
	});

	const counts = {
		all: products.length,
		livestock: products.filter((p) => p.product_type === "livestock").length,
		processed: products.filter((p) => p.product_type === "processed").length,
	};

	const getAddButtonLabel = () => {
		if (activeFilter === "livestock") return "Add Livestock";
		return "Add Product";
	};

	const getPageTitle = () => {
		if (statusFilter === "draft") return "Drafts";
		if (statusFilter === "pending") return "Pending Approval";
		if (statusFilter === "published") return "Published";
		if (statusFilter === "sold") return "Sold";
		return "Products";
	};

	const handleTableAction = (action: string, product: Product) => {
		if (action === "edit") {
			router.push(`/dashboard/products/edit/${product.id}`);
			return;
		}
		if (action === "view") {
			if (product.status === "sold") {
				router.push(`/dashboard/products/sold/${product.id}`);
			} else {
				router.push(`/dashboard/products/view/${product.id}`);
			}
			return;
		}
		if (action === "delete") {
			setConfirmModal({ open: true, action, product, loading: false });
			return;
		}
		if (action === "submit") {
			setConfirmModal({ open: true, action, product, loading: false });
			return;
		}
		setConfirmModal({ open: true, action, product, loading: false });
	};

	const [kycAlertMessage, setKycAlertMessage] = useState<string | null>(null);

	const executeAction = async () => {
		const { action, product } = confirmModal;
		if (!product) return;

		setConfirmModal((prev) => ({ ...prev, loading: true }));
		const token = getToken();

		try {
			if (action === "delete") {
				const res = await fetch(`/api/products/${product.id}`, {
					method: "DELETE",
					headers: { Authorization: `Bearer ${token}` },
				});
				if (res.ok) {
					setProducts((prev) => prev.filter((p) => p.id !== product.id));
					setConfirmModal({ open: false, action: "", product: null, loading: false });
					setDeleted(true);
					return;
				}
			} else if (["submit", "withdraw", "delist", "relist", "archive"].includes(action)) {
				const statusMap: Record<string, string> = {
					submit: "pending",
					withdraw: "draft",
					delist: "pending",
					relist: "published",
					archive: "draft",
				};
				const res = await fetch(`/api/products/${product.id}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ status: statusMap[action] }),
				});

				const data = await res.json();
				if (res.ok) {
					setProducts((prev) => prev.filter((p) => p.id !== product.id));
					setConfirmModal({ open: false, action: "", product: null, loading: false });
					if (action === "submit") {
						setSubmitted(true);
					}
					return;
				} else if (res.status === 403 || data.requiresKycUpgrade) {
					setConfirmModal({ open: false, action: "", product: null, loading: false });
					setKycAlertMessage(data.error || "Tier 1 KYC verification is required to publish products on the marketplace.");
					return;
				}
			}
		} catch {
			// silent
		}

		setConfirmModal({ open: false, action: "", product: null, loading: false });
	};

	const getConfirmMessage = () => {
		const { action, product } = confirmModal;
		if (!product) return "";
		switch (action) {
			case "delete": return `Are you sure you want to delete "${product.product_name}"? This action cannot be undone.`;
			case "submit": return `Submit "${product.product_name}" for approval? It will be reviewed before publishing.`;
			case "withdraw": return `Withdraw "${product.product_name}" from review? It will be moved back to drafts.`;
			case "delist": return `Delist "${product.product_name}"? It will be removed from the marketplace.`;
			case "relist": return `Relist "${product.product_name}"? It will be moved back to published status.`;
			case "archive": return `Archive "${product.product_name}"? It will be hidden from your sold listings.`;
			default: return "";
		}
	};

	const getConfirmButtonLabel = () => {
		switch (confirmModal.action) {
			case "delete": return "Delete";
			case "submit": return "Submit for Approval";
			case "withdraw": return "Withdraw";
			case "delist": return "Delist";
			case "relist": return "Relist";
			case "archive": return "Archive";
			default: return "Confirm";
		}
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
						<span className="text-gray-900 font-medium">{getPageTitle()}</span>
					</div>

					{/* Table Missing Setup */}
					{tableMissing && (
						<div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
							<div className="flex items-start gap-4">
								<div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
									<AlertTriangle className="w-5 h-5 text-amber-600" />
								</div>
								<div className="flex-1">
									<h3 className="font-semibold text-amber-900 mb-1">
										Products table not found
									</h3>
									<p className="text-sm text-amber-700 mb-4">
										The products table needs to be created in your Supabase database before you can add products.
									</p>
									<div className="flex flex-wrap gap-3">
										<button
											onClick={handleAutoSetup}
											disabled={setupLoading}
											className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition disabled:opacity-50"
										>
											<Database className="w-4 h-4" />
											{setupLoading ? "Setting up..." : "Auto-Setup"}
										</button>
										<button
											onClick={handleCopySql}
											className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition"
										>
											{copied ? "Copied!" : "Copy SQL"}
										</button>
										<a
											href={`https://supabase.com/dashboard/project/${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0]}/sql/new`}
											target="_blank"
											rel="noopener noreferrer"
											className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition"
										>
											Open SQL Editor
										</a>
									</div>
									{setupResult && (
										<p className={`text-sm mt-3 ${setupResult.includes("created") ? "text-green-700" : "text-red-700"}`}>
											{setupResult}
										</p>
									)}
									<details className="mt-4">
										<summary className="text-xs text-amber-600 cursor-pointer hover:text-amber-800">
											Show SQL
										</summary>
										<pre className="mt-2 p-3 bg-amber-100 rounded-lg text-xs text-amber-800 overflow-x-auto whitespace-pre-wrap">
											{MIGRATION_SQL}
										</pre>
									</details>
								</div>
							</div>
						</div>
					)}

					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<FilterTabs
							activeFilter={activeFilter}
							onFilterChange={setActiveFilter}
							counts={counts}
						/>

						<div className="flex items-center gap-3">
							<button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
								<Grid3X3 className="w-4 h-4" />
								Grid View
							</button>
							<button
								onClick={() => router.push("/dashboard/products/add")}
								className="flex items-center gap-2 px-5 py-2.5 bg-[#014834] text-white rounded-xl font-medium hover:bg-[#013824] transition"
							>
								<Plus className="w-4 h-4" />
								{getAddButtonLabel()}
							</button>
						</div>
					</div>

					{/* Products */}
					{loading ? (
						<div className="flex items-center justify-center py-20">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#014834]" />
						</div>
					) : filteredProducts.length === 0 && !tableMissing ? (
						<div className="flex flex-col items-center justify-center py-20">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
								<svg viewBox="0 0 40 40" fill="none" className="w-8 h-8 text-gray-400">
									<path d="M8 32h24M12 32V16l8-8 8 8v16" stroke="currentColor" strokeWidth="2" fill="none" />
								</svg>
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-1">No products yet</h3>
							<p className="text-gray-500 mb-4">Create your first product to get started</p>
							<button
								onClick={() => router.push("/dashboard/products/add")}
								className="flex items-center gap-2 px-5 py-2.5 bg-[#014834] text-white rounded-xl font-medium hover:bg-[#013824] transition"
							>
								<Plus className="w-4 h-4" />
								{getAddButtonLabel()}
							</button>
						</div>
					) : !tableMissing ? (
						statusFilter ? (
							<ProductTable
								products={filteredProducts}
								onAction={handleTableAction}
							/>
						) : (
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								{filteredProducts.map((product) => (
									<ProductCard key={product.id} product={product} />
								))}
							</div>
						)
					) : null}

					{/* Confirm Modals */}
					<ConfirmSubmitModal
						open={confirmModal.open && confirmModal.action === "submit"}
						loading={confirmModal.loading}
						onCancel={() => setConfirmModal({ open: false, action: "", product: null, loading: false })}
						onConfirm={executeAction}
					/>
					<ConfirmDeleteModal
						open={confirmModal.open && confirmModal.action === "delete"}
						loading={confirmModal.loading}
						onCancel={() => setConfirmModal({ open: false, action: "", product: null, loading: false })}
						onConfirm={executeAction}
					/>
					<SubmittedModal open={submitted} />
					<DeletedModal open={deleted} />

				{/* Withdraw / Delist / Relist / Archive Confirm Modal */}
				{confirmModal.open && confirmModal.product && ["withdraw", "delist", "relist", "archive"].includes(confirmModal.action) && (
						<div className="fixed inset-0 z-50 flex items-center justify-center">
							<div className="absolute inset-0 bg-black/40" onClick={() => !confirmModal.loading && setConfirmModal({ open: false, action: "", product: null, loading: false })} />
							<div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
								<button
									onClick={() => !confirmModal.loading && setConfirmModal({ open: false, action: "", product: null, loading: false })}
									className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg"
								>
									<X className="w-5 h-5 text-gray-400" />
								</button>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Action</h3>
								<p className="text-sm text-gray-600 mb-6">{getConfirmMessage()}</p>
								<div className="flex gap-3 justify-end">
									<button
										onClick={() => setConfirmModal({ open: false, action: "", product: null, loading: false })}
										disabled={confirmModal.loading}
										className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
									>
										Cancel
									</button>
									<button
										onClick={executeAction}
										disabled={confirmModal.loading}
										className="px-4 py-2 rounded-xl text-sm font-medium text-white transition disabled:opacity-50 bg-[#014834] hover:bg-[#013824]"
									>
										{confirmModal.loading ? "Processing..." : getConfirmButtonLabel()}
									</button>
								</div>
							</div>
						</div>
					)}
					{/* KYC Upgrade Required Modal */}
					{kycAlertMessage && (
						<div className="fixed inset-0 z-50 flex items-center justify-center">
							<div className="absolute inset-0 bg-black/40" onClick={() => setKycAlertMessage(null)} />
							<div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 text-center">
								<div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<AlertTriangle className="w-6 h-6 text-amber-600" />
								</div>
								<h3 className="text-lg font-bold text-gray-900 mb-2">KYC Verification Required</h3>
								<p className="text-sm text-gray-600 mb-6">{kycAlertMessage}</p>
								<div className="flex gap-3 justify-center">
									<button
										onClick={() => setKycAlertMessage(null)}
										className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
									>
										Cancel
									</button>
									<a
										href="/kyc"
										className="px-5 py-2.5 bg-[#014834] text-white rounded-xl text-sm font-medium hover:bg-[#013824] transition inline-block"
									>
										Upgrade to Tier 1
									</a>
								</div>
							</div>
						</div>
					)}
				</div>
			</DashboardLayout>
		</AuthGuard>
	);
};

export default ProductsPage;
