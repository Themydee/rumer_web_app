"use client";
import React, { useState } from "react";
import BusinessInfoStep from "./components/BusinessInfoStep";
import { updateAccountSetup } from "@/components/lib/supabase/profiles";
import AuthGuard from "@/components/AuthGuard";

type ProfileStep = "business-info";

interface ProfileData {
	businessName: string;
	address: string;
	flatUnit: string;
	lga: string;
	state: string;
	country: string;
	livestockTypes: string[];
}

const ProfileCompletionPage = () => {
	const [currentStep, setCurrentStep] = useState<ProfileStep>("business-info");
	const [formData, setFormData] = useState<ProfileData>({
		businessName: "",
		address: "",
		flatUnit: "",
		lga: "",
		state: "",
		country: "",
		livestockTypes: [],
	});

	const handleBusinessInfoSubmit = async (data: ProfileData) => {
		setFormData(data);
		// Combine address fields into farm_location
		const farmLocation = [data.address, data.flatUnit, data.lga, data.state, data.country]
			.filter(Boolean)
			.join(", ");
		await updateAccountSetup("", {
			farm_name: data.businessName,
			farm_location: farmLocation,
			livestock_types: data.livestockTypes,
		});
		// Redirect to dashboard or next step
		window.location.href = "/dashboard";
	};

	const handleBack = () => {
		window.location.href = "/dashboard";
	};

	return (
		<AuthGuard>
			<div className="min-h-screen bg-white">
				{currentStep === "business-info" && (
					<BusinessInfoStep
						formData={formData}
						onSubmit={handleBusinessInfoSubmit}
						onBack={handleBack}
					/>
				)}
			</div>
		</AuthGuard>
	);
};

export default ProfileCompletionPage;
