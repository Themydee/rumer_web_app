"use client";
import React, { useState } from "react";
import VerifyRegisteredBusiness from "./components/VerifyRegisteredBusiness";
import BusinessBankAccount from "./components/BusinessBankAccount";
import BusinessAddressVerification from "./components/BusinessAddressVerification";
import DeclarationConsent from "./components/DeclarationConsent";
import SubmittingBusinessVerification from "./components/SubmittingBusinessVerification";
import AuthGuard from "@/components/AuthGuard";
import { BusinessData } from "./components/types";

import { useAppDispatch } from "@/components/hooks";
import { authLogin } from "@/components/set-up/redux/children/auth";
import { getCurrentUser, getToken } from "@/components/lib/supabase/auth";
import { toUserType } from "@/components/lib/user";

type BusinessStep =
	| "verify-business"
	| "bank-account"
	| "address-verification"
	| "declaration"
	| "submitting";

const stepOrder: BusinessStep[] = [
	"verify-business",
	"bank-account",
	"address-verification",
	"declaration",
	"submitting",
];

async function uploadDoc(file: File | null): Promise<string | null> {
	if (!file) return null;
	try {
		const fd = new FormData();
		fd.append("file", file);
		const res = await fetch("/api/auth/upload-kyc-document", {
			method: "POST",
			body: fd,
		});
		if (!res.ok) return null;
		const data = await res.json();
		return data.url || null;
	} catch {
		return null;
	}
}

const BusinessVerificationPage = () => {
	const dispatch = useAppDispatch();
	const [currentStep, setCurrentStep] = useState<BusinessStep>("verify-business");
	const [formData, setFormData] = useState<BusinessData>({
		businessName: "",
		cacFile: null,
		cacStatus: "",
		bankName: "",
		accountNumber: "",
		accountName: "",
		proofOfAddressType: "",
		proofOfAddressFile: null,
		declarationConsent: false,
		termsConsent: false,
	});

	const currentStepIndex = stepOrder.indexOf(currentStep);

	const handleNext = async (stepData: Partial<BusinessData>) => {
		const updatedData = { ...formData, ...stepData };
		setFormData(updatedData);

		const nextIndex = currentStepIndex + 1;
		if (nextIndex < stepOrder.length) {
			const nextStep = stepOrder[nextIndex];
			setCurrentStep(nextStep);

			if (nextStep === "submitting") {
				try {
					const [cacUrl, addressUrl] = await Promise.all([
						uploadDoc(updatedData.cacFile),
						uploadDoc(updatedData.proofOfAddressFile),
					]);

					const token = getToken();
					if (token) {
						await fetch("/api/kyc/business", {
							method: "POST",
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								businessName: updatedData.businessName,
								cacStatus: updatedData.cacStatus,
								bankName: updatedData.bankName,
								accountNumber: updatedData.accountNumber,
								accountName: updatedData.accountName,
								proofOfAddressType: updatedData.proofOfAddressType,
								declarationConsent: updatedData.declarationConsent,
								termsConsent: updatedData.termsConsent,
								cacFileUrl: cacUrl,
								proofOfAddressFileUrl: addressUrl,
							}),
						});

						const user = await getCurrentUser();
						if (user) {
							dispatch(authLogin({ token, user: toUserType(user) as any }));
						}
					}
				} catch (err) {
					console.error("Business verification submission failed:", err);
				}
			}
		}
	};

	const handleBack = () => {
		const prevIndex = currentStepIndex - 1;
		if (prevIndex >= 0) {
			setCurrentStep(stepOrder[prevIndex]);
		}
	};

	const handleBackToDashboard = () => {
		window.location.href = "/dashboard";
	};

	return (
		<AuthGuard>
			<div className="min-h-screen bg-white">
				{currentStep === "verify-business" && (
					<VerifyRegisteredBusiness
						formData={formData}
						onNext={handleNext}
						onBack={handleBackToDashboard}
					/>
				)}

				{currentStep === "bank-account" && (
					<BusinessBankAccount
						formData={formData}
						onNext={handleNext}
						onBack={handleBack}
					/>
				)}

				{currentStep === "address-verification" && (
					<BusinessAddressVerification
						formData={formData}
						onNext={handleNext}
						onBack={handleBack}
					/>
				)}

				{currentStep === "declaration" && (
					<DeclarationConsent
						formData={formData}
						onNext={handleNext}
						onBack={handleBack}
					/>
				)}

				{currentStep === "submitting" && (
					<SubmittingBusinessVerification
						onContinue={handleBackToDashboard}
						onBackToDashboard={handleBackToDashboard}
					/>
				)}
			</div>
		</AuthGuard>
	);
};

export default BusinessVerificationPage;
