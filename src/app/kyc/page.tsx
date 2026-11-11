"use client";
import React, { useState } from "react";
import VerifyIdentityForm from "./components/VerifyIdentityForm";
import VerifyPersonalDetails from "./components/VerifyPersonalDetails";
import DocumentScan from "./components/DocumentScan";
import FaceLivenessCheck from "./components/FaceLivenessCheck";
import SubmissionReview from "./components/SubmissionReview";
import AuthGuard from "@/components/AuthGuard";
import { useAppDispatch } from "@/components/hooks";
import { authLogin } from "@/components/set-up/redux/children/auth";
import { getCurrentUser, getToken } from "@/components/lib/supabase/auth";
import { toUserType } from "@/components/lib/user";

type KycStep =
	| "verify-identity"
	| "verify-personal-details"
	| "document-scan"
	| "face-liveness"
	| "submission-review";

const KycPage = () => {
	const dispatch = useAppDispatch();
	const [currentStep, setCurrentStep] = useState<KycStep>("verify-identity");
	const [kycData, setKycData] = useState({
		bvn: "",
		idType: "",
		idFile: null as File | null,
		idFileUrl: "",
		nin: "",
		gender: "",
		dateOfBirth: "",
	});

	const handleIdentitySubmit = (data: { bvn: string; idType: string; idFileUrl?: string }) => {
		setKycData({ ...kycData, ...data, idFileUrl: data.idFileUrl || kycData.idFileUrl });
		setCurrentStep("verify-personal-details");
	};

	const handlePersonalDetailsSubmit = async (data: any) => {
		setKycData({ ...kycData, ...data });
		setCurrentStep("document-scan");
	};

	const handleDocumentScanComplete = () => {
		setCurrentStep("face-liveness");
	};

	const handleFaceLivenessComplete = async () => {
		try {
			const token = getToken();
			if (token) {
				await fetch("/api/kyc/individual", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						bvn: kycData.bvn,
						id_type: kycData.idType,
						id_number: kycData.nin,
						id_file_url: kycData.idFileUrl,
						gender: kycData.gender,
						date_of_birth: kycData.dateOfBirth,
					}),
				});
			}
		} catch (e) {
			console.error("KYC submission error:", e);
		}
		setCurrentStep("submission-review");
	};

	const handleSubmissionContinue = async () => {
		const token = getToken();
		if (token) {
			const user = await getCurrentUser();
			if (user) {
				dispatch(authLogin({ token, user: toUserType(user) as any }));
			}
		}
		window.location.href = "/dashboard";
	};

	const handleBack = () => {
		switch (currentStep) {
			case "verify-personal-details":
				setCurrentStep("verify-identity");
				break;
			case "document-scan":
				setCurrentStep("verify-personal-details");
				break;
			case "face-liveness":
				setCurrentStep("document-scan");
				break;
			case "submission-review":
				setCurrentStep("face-liveness");
				break;
			default:
				window.location.href = "/dashboard";
		}
	};

	return (
		<AuthGuard>
			<div className="min-h-screen bg-white">
				{currentStep === "verify-identity" && (
					<VerifyIdentityForm
						formData={kycData}
						onSubmit={handleIdentitySubmit}
						onBack={handleBack}
					/>
				)}

				{currentStep === "verify-personal-details" && (
					<VerifyPersonalDetails
						formData={kycData}
						onSubmit={handlePersonalDetailsSubmit}
						onBack={handleBack}
					/>
				)}

				{currentStep === "document-scan" && (
					<DocumentScan
						idType={kycData.idType}
						onComplete={handleDocumentScanComplete}
						onCancel={handleBack}
					/>
				)}

				{currentStep === "face-liveness" && (
					<FaceLivenessCheck
						onComplete={handleFaceLivenessComplete}
						onCancel={handleBack}
					/>
				)}

				{currentStep === "submission-review" && (
					<SubmissionReview
						onContinue={handleSubmissionContinue}
						onCancel={handleBack}
					/>
				)}
			</div>
		</AuthGuard>
	);
};

export default KycPage;
