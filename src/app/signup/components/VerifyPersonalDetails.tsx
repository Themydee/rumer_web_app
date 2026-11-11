"use client";
import React from "react";
import { Button } from "@heroui/react";
import AuthLayout from "./AuthLayout";

interface VerifyPersonalDetailsProps {
	formData: {
		role: string;
		idType: string;
		idNumber: string;
		email: string;
		phone: string;
		firstName: string;
		lastName: string;
		password: string;
		businessType: string;
		farmName: string;
		farmLocation: string;
		livestockTypes: string[];
	};
	onConfirm: () => void;
	onBack?: () => void;
}

const VerifyPersonalDetails = ({
	formData,
	onConfirm,
	onBack,
}: VerifyPersonalDetailsProps) => {
	return (
		<AuthLayout showBack showLogout onBack={onBack} step={3}>
			<div>
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Verify your personal details
				</h1>
				<p className="text-gray-600 mb-6">
					Please confirm your information is correct before proceeding.
				</p>

				<div className="space-y-4">
					{/* Personal Information */}
					<div className="bg-gray-50 rounded-xl p-4">
						<h3 className="font-medium text-gray-900 mb-3">Personal Information</h3>
						<div className="space-y-2">
							<div className="flex justify-between items-center py-2 border-b border-gray-200">
								<span className="text-gray-600 text-sm">Full Name</span>
								<span className="font-medium text-gray-900 text-sm">
									{formData.firstName} {formData.lastName}
								</span>
							</div>
							<div className="flex justify-between items-center py-2 border-b border-gray-200">
								<span className="text-gray-600 text-sm">Email</span>
								<span className="font-medium text-gray-900 text-sm">{formData.email}</span>
							</div>
							<div className="flex justify-between items-center py-2">
								<span className="text-gray-600 text-sm">Phone</span>
								<span className="font-medium text-gray-900 text-sm">{formData.phone}</span>
							</div>
						</div>
					</div>

					{/* Business Information */}
					<div className="bg-gray-50 rounded-xl p-4">
						<h3 className="font-medium text-gray-900 mb-3">Business Information</h3>
						<div className="space-y-2">
							<div className="flex justify-between items-center py-2 border-b border-gray-200">
								<span className="text-gray-600 text-sm">Account Type</span>
								<span className="font-medium text-gray-900 text-sm capitalize">
									{formData.businessType || "Individual"}
								</span>
							</div>
							<div className="flex justify-between items-center py-2 border-b border-gray-200">
								<span className="text-gray-600 text-sm">Farm/Business Name</span>
								<span className="font-medium text-gray-900 text-sm">
									{formData.farmName || "Not provided"}
								</span>
							</div>
							<div className="flex justify-between items-center py-2 border-b border-gray-200">
								<span className="text-gray-600 text-sm">Location</span>
								<span className="font-medium text-gray-900 text-sm">
									{formData.farmLocation || "Not provided"}
								</span>
							</div>
							<div className="flex justify-between items-center py-2">
								<span className="text-gray-600 text-sm">Livestock Types</span>
								<span className="font-medium text-gray-900 text-sm">
									{formData.livestockTypes?.join(", ") || "Not provided"}
								</span>
							</div>
						</div>
					</div>

					<Button
						onClick={onConfirm}
						className="w-full bg-[#014834] text-white font-medium py-3 rounded-xl hover:bg-[#013628] transition-colors"
					>
						Confirm & Continue
					</Button>
				</div>
			</div>
		</AuthLayout>
	);
};

export default VerifyPersonalDetails;
