"use client";
import React, { useState } from "react";
import CertificateOfRegistration from "./components/CertificateOfRegistration";
import TaxIdentification from "./components/TaxIdentification";
import CooperativeConstitution from "./components/CooperativeConstitution";
import ElectedOfficers from "./components/ElectedOfficers";
import CooperativeAuthority from "./components/CooperativeAuthority";
import CooperativeBankAccount from "./components/CooperativeBankAccount";
import GovernanceCompliance from "./components/GovernanceCompliance";
import SubmittingVerification from "./components/SubmittingVerification";
import AuthGuard from "@/components/AuthGuard";

import { useAppDispatch } from "@/components/hooks";
import { authLogin } from "@/components/set-up/redux/children/auth";
import { getCurrentUser, getToken } from "@/components/lib/supabase/auth";
import { toUserType } from "@/components/lib/user";

type CooperativeStep =
	| "certificate"
	| "tin"
	| "constitution"
	| "officers"
	| "authority"
	| "bank-account"
	| "governance"
	| "submitting";

interface CooperativeData {
	cooperativeName: string;
	certificateFile: File | null;
	tin: string;
	constitutionFile: File | null;
	officers: Array<{
		fullName: string;
		role: string;
		phone: string;
		email: string;
	}>;
	authorityFile: File | null;
	bankName: string;
	accountNumber: string;
	accountName: string;
	governanceFile: File | null;
	isEewylaCluster: boolean;
	eewylaFile: File | null;
}

const stepOrder: CooperativeStep[] = [
	"certificate",
	"tin",
	"constitution",
	"officers",
	"authority",
	"bank-account",
	"governance",
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

const CooperativeVerificationPage = () => {
	const dispatch = useAppDispatch();
	const [currentStep, setCurrentStep] = useState<CooperativeStep>("certificate");
	const [formData, setFormData] = useState<CooperativeData>({
		cooperativeName: "",
		certificateFile: null,
		tin: "",
		constitutionFile: null,
		officers: [{ fullName: "", role: "", phone: "", email: "" }],
		authorityFile: null,
		bankName: "",
		accountNumber: "",
		accountName: "",
		governanceFile: null,
		isEewylaCluster: false,
		eewylaFile: null,
	});

	const currentStepIndex = stepOrder.indexOf(currentStep);

	const handleNext = async (stepData: Partial<CooperativeData>) => {
		const updatedData = { ...formData, ...stepData };
		setFormData(updatedData);

		const nextIndex = currentStepIndex + 1;
		if (nextIndex < stepOrder.length) {
			const nextStep = stepOrder[nextIndex];
			setCurrentStep(nextStep);

			if (nextStep === "submitting") {
				try {
					const [certUrl, constUrl, authUrl, govUrl, eewylaUrl] = await Promise.all([
						uploadDoc(updatedData.certificateFile),
						uploadDoc(updatedData.constitutionFile),
						uploadDoc(updatedData.authorityFile),
						uploadDoc(updatedData.governanceFile),
						uploadDoc(updatedData.eewylaFile),
					]);

					const token = getToken();
					if (token) {
						await fetch("/api/kyc/cooperative", {
							method: "POST",
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								cooperativeName: updatedData.cooperativeName,
								tin: updatedData.tin,
								officers: updatedData.officers,
								bankName: updatedData.bankName,
								accountNumber: updatedData.accountNumber,
								accountName: updatedData.accountName,
								isEewylaCluster: updatedData.isEewylaCluster,
								constitutionUrl: constUrl,
								authorityLetterUrl: authUrl,
								governanceRulesUrl: govUrl,
								eewylaFileUrl: eewylaUrl,
							}),
						});

						const user = await getCurrentUser();
						if (user) {
							dispatch(authLogin({ token, user: toUserType(user) as any }));
						}
					}
				} catch (err) {
					console.error("Cooperative verification submission failed:", err);
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
				{currentStep === "certificate" && (
					<CertificateOfRegistration
						formData={formData}
						onNext={handleNext}
						onBack={handleBackToDashboard}
					/>
				)}

				{currentStep === "tin" && (
					<TaxIdentification
						formData={formData}
						onNext={handleNext}
						onBack={handleBack}
					/>
				)}

				{currentStep === "constitution" && (
					<CooperativeConstitution
						formData={formData}
						onNext={handleNext}
						onBack={handleBack}
					/>
				)}

				{currentStep === "officers" && (
					<ElectedOfficers
						formData={formData}
						onNext={handleNext}
						onBack={handleBack}
					/>
				)}

				{currentStep === "authority" && (
					<CooperativeAuthority
						formData={formData}
						onNext={handleNext}
						onBack={handleBack}
					/>
				)}

				{currentStep === "bank-account" && (
					<CooperativeBankAccount
						formData={formData}
						onNext={handleNext}
						onBack={handleBack}
					/>
				)}

				{currentStep === "governance" && (
					<GovernanceCompliance
						formData={formData}
						onNext={handleNext}
						onBack={handleBack}
					/>
				)}

				{currentStep === "submitting" && (
					<SubmittingVerification
						onContinue={handleBackToDashboard}
						onBackToDashboard={handleBackToDashboard}
					/>
				)}
			</div>
		</AuthGuard>
	);
};

export default CooperativeVerificationPage;
