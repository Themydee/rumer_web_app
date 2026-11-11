"use client";
import React, { useState } from "react";
import CreateAccount from "./components/CreateAccount";
import CheckEmail from "./components/CheckEmail";
import VerifyOTP from "./components/VerifyOTP";
import SelectRole from "./components/SelectRole";
import FarmDetails from "./components/FarmDetails";
import BuyerDetails from "./components/BuyerDetails";
import PersonalDetailsForm from "./components/PersonalDetailsForm";
import PreparingAccount from "./components/PreparingAccount";
import { updateAccountSetup } from "@/components/lib/supabase/profiles";

type SignupStep =
	| "create-account"
	| "check-email"
	| "verify-otp-email"
	| "select-role"
	| "farm-details"
	| "buyer-details"
	| "personal-details"
	| "preparing";

const SellerSignupPage = () => {
	const [currentStep, setCurrentStep] = useState<SignupStep>("create-account");
	const [formData, setFormData] = useState({
		role: "",
		email: "",
		phone: "",
		firstName: "",
		lastName: "",
		password: "",
		farmName: "",
		farmLocation: "",
		livestockTypes: [] as string[],
		otherLivestock: "",
		dateOfBirth: "",
		homeAddress: "",
		flatUnit: "",
		lga: "",
		state: "",
	});

	const handleAccountCreate = (email: string, password: string, firstName: string, lastName: string) => {
		setFormData({ ...formData, email, password, firstName, lastName });
		setCurrentStep("check-email");
	};

	const handleEmailContinue = () => {
		setCurrentStep("verify-otp-email");
	};

	const handleEmailOTPVerified = () => {
		setCurrentStep("select-role");
	};

	const handleSelectRole = async (data: { role: string }) => {
		setFormData({ ...formData, role: data.role });
		// Persist business_type to profile
		const businessType = data.role === "farmer" ? "individual" : data.role === "trader" ? "trader" : "business";
		await updateAccountSetup("", { business_type: businessType as "individual" | "business" | "trader" });
		// Route based on role
		if (data.role === "farmer") {
			setCurrentStep("farm-details");
		} else if (data.role === "trader") {
			setCurrentStep("buyer-details");
		} else {
			setCurrentStep("personal-details");
		}
	};

	const handleFarmDetails = async (data: { farmName: string; livestockTypes: string[]; otherLivestock: string }) => {
		setFormData({ ...formData, ...data });
		await updateAccountSetup("", {
			farm_name: data.farmName,
			livestock_types: data.livestockTypes,
		});
		setCurrentStep("personal-details");
	};

	const handleBuyerDetails = async (data: { buyerType: string; livestockTypes: string[]; otherLivestock: string }) => {
		setFormData({ ...formData, ...data });
		await updateAccountSetup("", {
			livestock_types: data.livestockTypes,
		});
		setCurrentStep("personal-details");
	};

	const handlePersonalDetails = async (data: {
		dateOfBirth: string;
		homeAddress: string;
		flatUnit: string;
		lga: string;
		state: string;
	}) => {
		setFormData({ ...formData, ...data });
		// Compose farm_location from address parts
		const parts = [data.homeAddress, data.flatUnit, data.lga, data.state].filter(Boolean);
		const farmLocation = parts.join(", ");
		await updateAccountSetup("", {
			farm_location: farmLocation,
			date_of_birth: data.dateOfBirth,
		});
		setCurrentStep("preparing");
	};

	const handleBack = () => {
		switch (currentStep) {
			case "check-email":
				setCurrentStep("create-account");
				break;
			case "verify-otp-email":
				setCurrentStep("check-email");
				break;
			case "select-role":
				setCurrentStep("verify-otp-email");
				break;
			case "farm-details":
				setCurrentStep("select-role");
				break;
			case "buyer-details":
				setCurrentStep("select-role");
				break;
			case "personal-details":
				if (formData.role === "trader") {
					setCurrentStep("buyer-details");
				} else if (formData.role === "farmer") {
					setCurrentStep("farm-details");
				} else {
					setCurrentStep("select-role");
				}
				break;
			default:
				setCurrentStep("create-account");
		}
	};

	return (
		<div className="min-h-screen bg-white">
			{currentStep === "create-account" && (
				<CreateAccount
					onSubmit={handleAccountCreate}
					onError={() => {}}
					onBack={handleBack}
				/>
			)}

			{currentStep === "check-email" && (
				<CheckEmail
					email={formData.email}
					name={`${formData.firstName} ${formData.lastName}`.trim() || "User"}
					onContinue={handleEmailContinue}
					onBack={handleBack}
				/>
			)}

			{currentStep === "verify-otp-email" && (
				<VerifyOTP
					email={formData.email}
					mode="email"
					onVerified={handleEmailOTPVerified}
					onBack={handleBack}
				/>
			)}

			{currentStep === "select-role" && (
				<SelectRole
					onSubmit={handleSelectRole}
					onBack={handleBack}
				/>
			)}

			{currentStep === "farm-details" && (
				<FarmDetails
					formData={formData}
					onSubmit={handleFarmDetails}
					onBack={handleBack}
				/>
			)}

			{currentStep === "buyer-details" && (
				<BuyerDetails
					onSubmit={handleBuyerDetails}
					onBack={handleBack}
				/>
			)}

			{currentStep === "personal-details" && (
				<PersonalDetailsForm
					formData={formData}
					onSubmit={handlePersonalDetails}
					onBack={handleBack}
				/>
			)}

			{currentStep === "preparing" && <PreparingAccount />}
		</div>
	);
};

export default SellerSignupPage;
