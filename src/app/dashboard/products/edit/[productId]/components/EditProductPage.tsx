"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { getToken } from "@/components/lib/supabase/auth";
import { addNotification } from "@/components/lib/notifications";
import { Product } from "@/components/lib/supabase/database.types";
import { Plus, X } from "lucide-react";
import { ConfirmSubmitModal, SubmittedModal } from "../../../components/ProductModals";

const BREEDS: Record<string, string[]> = {
	Cattle: [
		"White Fulani",
		"Red Bororo",
		"Ndama",
		"Sokoto Gudali",
		"Rahaji",
		"Azawak",
		"Ambala",
		"Bunaji",
		"Keteku",
		"Jereko",
	],
	Goat: [
		"West African Dwarf",
		"Red Sokoto",
		"Sahel",
		"West African Long Leg",
		"Kambawa",
	],
	Sheep: [
		"West African Dwarf Sheep",
		"Balami",
		"Uda",
		"Yakessa",
		"Djallonke",
	],
	Poultry: [
		"Noiler",
		"Amuro",
		"Funke",
		"Nigerian Local Chicken",
		"Broiler",
		"Layer",
	],
	Fish: [
		"Catfish (Clarias gariepinus)",
		"Tilapia (Oreochromis niloticus)",
		"Heterobranchus",
		"Carp",
		"Mackerel",
	],
	Pig: [
		"Large White",
		"Landrace",
		"Duroc",
		"Hampshire",
		"West African Indigenous",
	],
};

const HS_CODES: Record<string, string> = {
	Cattle: "010229",
	Goat: "010420",
	Sheep: "010410",
	Poultry: "010599",
	Fish: "030199",
	Pig: "010399",
};

const PROCESSED_CUT_TYPES = [
	"Whole",
	"Half",
	"Quarter",
	"Breast",
	"Thigh",
	"Leg",
	"Shoulder",
	"Ribs",
	"Loin",
	"Fillet",
	"Steak",
	"Mince",
	"Chops",
	"Ground",
];

interface EditProductPageProps {
	productId: string;
}

interface EditFormData {
	productType: "livestock" | "processed";
	listingType: "individual" | "bulk" | "";
	productName: string;
	livestockType: string;
	cutType: string;
	processedCutType: string;
	age: string;
	unitSize: string;
	unitMeasure: "Kg" | "Pack";
	storageType: string;
	hsCode: string;
	basePrice: string;
	description: string;
	images: string[];
}

const EditProductPage = ({ productId }: EditProductPageProps) => {
	const router = useRouter();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [submitModal, setSubmitModal] = useState({ open: false, loading: false });
	const [submitted, setSubmitted] = useState(false);

	const [formData, setFormData] = useState<EditFormData>({
		productType: "livestock",
		listingType: "",
		productName: "",
		livestockType: "",
		cutType: "",
		processedCutType: "",
		age: "",
		unitSize: "",
		unitMeasure: "Kg",
		storageType: "",
		hsCode: "",
		basePrice: "",
		description: "",
		images: [],
	});
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadingImage, setUploadingImage] = useState(false);

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
				const p: Product = data.product;
				setProduct(p);
				setFormData({
					productType: p.product_type,
					listingType: p.listing_type || "",
					productName: p.product_name,
					livestockType: p.livestock_type || "",
					cutType: p.cut_type || "",
					processedCutType: (p as any).processed_cut_type || "",
					age: (p as any).age?.toString() || "",
					unitSize: p.unit_size?.toString() || "",
					unitMeasure: p.unit_measure || "Kg",
					storageType: p.storage_type || "",
					hsCode: p.hs_code || "",
					basePrice: p.base_price?.toString() || "",
					description: p.description || "",
					images: (p as any).images || [],
				});
			} else {
				setError(data.error || "Product not found");
			}
		} catch {
			setError("Failed to load product");
		}
		setLoading(false);
	};

	const updateForm = (updates: Partial<EditFormData>) => {
		setFormData((prev) => ({ ...prev, ...updates }));
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setUploadingImage(true);
		const newImages: string[] = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const formDataUpload = new FormData();
			formDataUpload.append("file", file);

			try {
				const token = getToken();
				const res = await fetch("/api/auth/upload-product-image", {
					method: "POST",
					headers: { Authorization: `Bearer ${token}` },
					body: formDataUpload,
				});
				const data = await res.json();
				if (res.ok && data.url) {
					newImages.push(data.url);
				}
			} catch (err) {
				console.error("Image upload failed:", err);
			}
		}

		if (newImages.length > 0) {
			updateForm({ images: [...formData.images, ...newImages] });
		}

		setUploadingImage(false);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleRemoveImage = (index: number) => {
		const newImages = formData.images.filter((_, i) => i !== index);
		updateForm({ images: newImages });
	};

	const saveProduct = async (status?: string) => {
		setSaving(true);
		setSaveError(null);
		const token = getToken();
		try {
			const res = await fetch(`/api/products/${productId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					productType: formData.productType,
					listingType: formData.listingType || undefined,
					productName: formData.productName,
					livestockType: formData.livestockType || undefined,
					cutType: formData.cutType || undefined,
					unitSize: formData.unitSize || undefined,
					unitMeasure: formData.unitMeasure,
					storageType: formData.storageType || undefined,
					hsCode: formData.hsCode || undefined,
					basePrice: formData.basePrice,
					description: formData.description || undefined,
					images: formData.images,
					...(status ? { status } : {}),
				}),
			});
			const data = await res.json();
			setSaving(false);
			if (res.ok) {
				return true;
			}
			setSaveError(data.error || "Failed to save product");
			return false;
		} catch {
			setSaving(false);
			setSaveError("Failed to save product");
			return false;
		}
	};

	const handleSaveDraft = async () => {
		const ok = await saveProduct("draft");
		if (ok) {
			router.push("/dashboard/products/drafts");
		}
	};

	const handleSubmitForApproval = async () => {
		setSubmitModal({ open: true, loading: true });
		const ok = await saveProduct("pending");
		setSubmitModal({ open: false, loading: false });
		if (ok) {
			setSubmitted(true);
			addNotification({
				title: "Product submitted for approval",
				message: "Your updated product has been submitted and is awaiting admin review.",
				type: "info",
				link: "/dashboard/products/pending",
			});
		}
	};

	const isLivestock = formData.productType === "livestock";
	const inputClass =
		"w-full px-4 py-3 border border-gray-250 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition appearance-none bg-white";
	const selectClass =
		"w-full px-4 py-3 border border-gray-250 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10";
	const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

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
						<span className="text-gray-900 font-medium">Edit Livestock</span>
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
							{/* Header */}
							<div className="flex items-center gap-3 mb-2">
								<h1 className="text-2xl font-bold text-gray-900">
									Edit {isLivestock ? "Livestock" : "Product"}
								</h1>
								<span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
									{product.status}
								</span>
							</div>
							<p className="text-xs text-amber-600 mb-6">This listing is not visible in the market</p>

							{/* Product Type Tabs */}
							<div className="grid grid-cols-2 gap-0 mb-8 bg-gray-100 rounded-xl p-1 max-w-2xl">
								<button
									onClick={() => updateForm({ productType: "livestock" })}
									className={`py-3 rounded-lg text-sm font-medium transition ${
										isLivestock ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
									}`}
								>
									Livestock
								</button>
								<button
									onClick={() => updateForm({ productType: "processed" })}
									className={`py-3 rounded-lg text-sm font-medium transition ${
										!isLivestock ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
									}`}
								>
									Processed Product (Red Meat)
								</button>
							</div>

							{/* Product Details Card */}
							<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
								<h2 className="text-base font-semibold text-gray-900 mb-6">Product Details</h2>

								{/* Product Images */}
								<div className="mb-6">
									<p className={labelClass}>Product Images <span className="text-red-500">*</span></p>
									<div className="flex items-center gap-3 flex-wrap">
										{formData.images.map((img, index) => (
											<div key={index} className="relative w-16 h-16 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 group">
												<img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
												<button
													type="button"
													onClick={() => handleRemoveImage(index)}
													className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
												>
													<X className="w-3 h-3" />
												</button>
											</div>
										))}
										<input
											type="file"
											ref={fileInputRef}
											onChange={handleImageUpload}
											accept="image/jpeg,image/png,image/webp,image/gif"
											multiple
											className="hidden"
										/>
										<button
											type="button"
											onClick={() => fileInputRef.current?.click()}
											disabled={uploadingImage}
											className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-[#014834] hover:text-[#014834] transition disabled:opacity-50"
										>
											{uploadingImage ? (
												<div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-[#014834]" />
											) : (
												<Plus className="w-5 h-5" />
											)}
										</button>
									</div>
									<p className="text-xs text-gray-400 mt-2">Upload up to 10 images (JPEG, PNG, WebP, GIF)</p>
								</div>

								{/* Form Grid */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
									<div>
										<label className={labelClass}>Product ID <span className="text-red-500">*</span></label>
										<input
											type="text"
											value={product.id.slice(0, 10)}
											disabled
											className={`${inputClass} bg-gray-50 text-gray-500`}
										/>
									</div>
								<div>
									<label className={labelClass}>Product Type <span className="text-red-500">*</span></label>
									<select
										value={formData.listingType}
										onChange={(e) => updateForm({ listingType: e.target.value as "individual" | "bulk" })}
										className={selectClass}
									>
										<option value="">Select Product Type</option>
										<option value="individual">1-of-1</option>
										<option value="bulk">Bulk</option>
									</select>
								</div>

								{isLivestock ? (
									<>
										<div>
											<label className={labelClass}>Species <span className="text-red-500">*</span></label>
											<select
												value={formData.livestockType}
												onChange={(e) => updateForm({ livestockType: e.target.value, cutType: "", hsCode: HS_CODES[e.target.value] || "" })}
												className={selectClass}
											>
												<option value="">Select Livestock</option>
												<option value="Cattle">Cattle</option>
												<option value="Goat">Goat</option>
												<option value="Sheep">Sheep</option>
												<option value="Poultry">Poultry</option>
												<option value="Fish">Fish</option>
												<option value="Pig">Pig</option>
											</select>
										</div>
										<div>
											<label className={labelClass}>Breed <span className="text-red-500">*</span></label>
											<select
												value={formData.cutType}
												onChange={(e) => updateForm({ cutType: e.target.value })}
												className={selectClass}
												disabled={!formData.livestockType}
											>
												<option value="">Select Breed</option>
												{(BREEDS[formData.livestockType] || []).map((breed) => (
													<option key={breed} value={breed}>
														{breed}
													</option>
												))}
											</select>
										</div>
										<div>
											<label className={labelClass}>HS Code</label>
											<input
												type="text"
												value={formData.hsCode}
												readOnly
												className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`}
											/>
										</div>
										<div>
											<label className={labelClass}>Age (months) <span className="text-red-500">*</span></label>
											<input
												type="number"
												value={formData.age}
												onChange={(e) => updateForm({ age: e.target.value })}
												placeholder="Enter age in months"
												className={inputClass}
												min="0"
											/>
										</div>
									</>
								) : (
									<>
										<div>
											<label className={labelClass}>Category <span className="text-red-500">*</span></label>
											<select
												value={formData.cutType}
												onChange={(e) => updateForm({ cutType: e.target.value })}
												className={selectClass}
											>
												<option value="">Select Category</option>
												<option value="Goat Meat">Goat Meat</option>
												<option value="Beef">Beef</option>
												<option value="Chicken">Chicken</option>
												<option value="Fish">Fish</option>
												<option value="Mutton">Mutton</option>
												<option value="Pork">Pork</option>
											</select>
										</div>
										<div>
											<label className={labelClass}>Cut Type <span className="text-red-500">*</span></label>
											<select
												value={formData.processedCutType}
												onChange={(e) => updateForm({ processedCutType: e.target.value })}
												className={selectClass}
											>
												<option value="">Select Cut Type</option>
												{PROCESSED_CUT_TYPES.map((cut) => (
													<option key={cut} value={cut}>
														{cut}
													</option>
												))}
											</select>
										</div>
										<div>
											<label className={labelClass}>Storage Type <span className="text-red-500">*</span></label>
											<select
												value={formData.storageType}
												onChange={(e) => updateForm({ storageType: e.target.value })}
												className={selectClass}
											>
												<option value="">Select Storage</option>
												<option value="Frozen">Frozen</option>
												<option value="Dried">Dried</option>
												<option value="Fresh">Fresh</option>
											</select>
										</div>
									</>
								)}

									<div>
										<label className={labelClass}>Weight (kg) <span className="text-red-500">*</span></label>
										<input
											type="number"
											value={formData.unitSize}
											onChange={(e) => updateForm({ unitSize: e.target.value })}
											placeholder="Enter weight"
											className={inputClass}
										/>
									</div>
									<div>
										<label className={labelClass}>Price (NGN) <span className="text-red-500">*</span></label>
										<input
											type="number"
											value={formData.basePrice}
											onChange={(e) => updateForm({ basePrice: e.target.value })}
											placeholder="Enter price"
											className={inputClass}
										/>
									</div>
								</div>

								{/* Description */}
								<div className="mt-5">
									<label className={labelClass}>Description <span className="text-red-500">*</span></label>
									<textarea
										value={formData.description}
										onChange={(e) => updateForm({ description: e.target.value })}
										placeholder="Enter Description"
										rows={4}
										maxLength={200}
										className={`${inputClass} resize-none`}
									/>
									<p className="text-xs text-gray-400 text-right mt-1">{formData.description.length}/200</p>
								</div>
							</div>

							{/* Error */}
							{saveError && (
								<p className="text-sm text-red-600 mb-4">{saveError}</p>
							)}

							{/* Action Buttons */}
							<div className="flex justify-between">
								<button
									onClick={() => router.push(`/dashboard/products/view/${product.id}`)}
									className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-100 transition"
								>
									Preview
								</button>
								<div className="flex gap-3">
									<button
										onClick={handleSaveDraft}
										disabled={saving}
										className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-100 transition disabled:opacity-50"
									>
										{saving ? "Saving..." : "Save Draft"}
									</button>
									<button
										onClick={() => setSubmitModal({ open: true, loading: false })}
										disabled={saving}
										className="px-6 py-3 bg-[#014834] text-white rounded-xl text-sm font-semibold hover:bg-[#013824] transition disabled:opacity-50"
									>
										Submit for Approval
									</button>
								</div>
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
				<SubmittedModal open={submitted} />
			</DashboardLayout>
		</AuthGuard>
	);
};

export default EditProductPage;
