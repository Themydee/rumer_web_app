"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import StepIndicator from "./StepIndicator";
import SelectProductType from "./SelectProductType";
import ProductListingType from "./ProductListingType";
import ProductDetailsForm from "./ProductDetailsForm";
import ConfirmReview from "./ConfirmReview";
import SuccessModal from "./SuccessModal";
import { createProduct } from "@/components/lib/supabase/auth";
import { addNotification } from "@/components/lib/notifications";

export interface ProductFormData {
	productType: "livestock" | "processed" | null;
	listingType: "individual" | "bulk" | null;
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
}

const STEPS_LIVESTOCK = [
	"Select Product Type",
	"Product Listing Type",
	"Product Details",
	"Confirm & Review Details",
	"Submit for Approval",
];

const STEPS_PROCESSED = [
	"Select Product Type",
	"Product Details",
	"Confirm & Review Details",
	"Submit for Approval",
];

const INITIAL_FORM: ProductFormData = {
	productType: null,
	listingType: null,
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
};

const AddProductPage = () => {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM);
	const [showSuccess, setShowSuccess] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const steps =
		formData.productType === "livestock" ? STEPS_LIVESTOCK : STEPS_PROCESSED;
	const totalSteps = steps.length;

	const updateForm = (updates: Partial<ProductFormData>) => {
		setFormData((prev) => ({ ...prev, ...updates }));
	};

	const goNext = () => {
		if (currentStep < totalSteps) {
			setCurrentStep((s) => s + 1);
		}
	};

	const goBack = () => {
		if (currentStep > 1) {
			setCurrentStep((s) => s - 1);
		}
	};

	const handleCancel = () => {
		router.push("/dashboard");
	};

	const handleSubmit = async () => {
		setSubmitting(true);
		setSubmitError(null);

		const result = await createProduct({
			productType: formData.productType!,
			listingType: formData.listingType || undefined,
			productName: formData.productName,
			livestockType: formData.livestockType || undefined,
			cutType: formData.cutType || undefined,
			processedCutType: formData.processedCutType || undefined,
			age: formData.age || undefined,
			unitSize: formData.unitSize || undefined,
			unitMeasure: formData.unitMeasure,
			storageType: formData.storageType || undefined,
			hsCode: formData.hsCode || undefined,
			basePrice: formData.basePrice,
			description: formData.description || undefined,
		});

		setSubmitting(false);

		if (!result.success) {
			setSubmitError(result.error || "Failed to create product");
			return;
		}

		setShowSuccess(true);
		addNotification({
			title: "Product created",
			message: `"${formData.productName}" has been created and saved as a draft.`,
			type: "success",
			link: "/dashboard/products/drafts",
		});
	};

	const handleAddStock = () => {
		router.push("/dashboard");
	};

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<SelectProductType
						selected={formData.productType}
						onSelect={(type) => updateForm({ productType: type })}
						onNext={goNext}
						onCancel={handleCancel}
					/>
				);
			case 2:
				if (formData.productType === "livestock") {
					return (
						<ProductListingType
							selected={formData.listingType}
							onSelect={(type) => updateForm({ listingType: type })}
							onNext={goNext}
							onBack={goBack}
						/>
					);
				}
				return (
					<ProductDetailsForm
						formData={formData}
						onUpdate={updateForm}
						onNext={goNext}
						onBack={goBack}
					/>
				);
			case 3:
				if (formData.productType === "livestock") {
					return (
						<ProductDetailsForm
							formData={formData}
							onUpdate={updateForm}
							onNext={goNext}
							onBack={goBack}
						/>
					);
				}
				return (
					<ConfirmReview
						formData={formData}
						onBack={goBack}
						onCreate={handleSubmit}
						submitting={submitting}
						error={submitError}
					/>
				);
			case 4:
				if (formData.productType === "livestock") {
					return (
						<ConfirmReview
							formData={formData}
							onBack={goBack}
							onCreate={handleSubmit}
							submitting={submitting}
							error={submitError}
						/>
					);
				}
				return null;
			case 5:
				return null;
			default:
				return null;
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
						<span className="text-gray-900 font-medium">Add Product</span>
					</div>

					{/* Step Indicator */}
					<StepIndicator steps={steps} currentStep={currentStep} />

					{/* Step Content */}
					<div className="mt-8">{renderStep()}</div>
				</div>

				{/* Success Modal */}
				{showSuccess && (
					<SuccessModal onAddStock={handleAddStock} />
				)}
			</DashboardLayout>
		</AuthGuard>
	);
};

export default AddProductPage;
