"use client";
import React, { useState, useEffect } from "react";

interface SubmissionReviewProps {
	onContinue: () => void;
	onCancel: () => void;
}

type ReviewStatus = "pending" | "verifying" | "verified";

const SubmissionReview = ({ onContinue, onCancel }: SubmissionReviewProps) => {
	const [personalInfoStatus, setPersonalInfoStatus] = useState<ReviewStatus>("pending");
	const [ninStatus, setNinStatus] = useState<ReviewStatus>("pending");

	useEffect(() => {
		// Simulate verification process
		const timer1 = setTimeout(() => {
			setPersonalInfoStatus("verifying");
		}, 1500);

		const timer2 = setTimeout(() => {
			setPersonalInfoStatus("verified");
			setNinStatus("verifying");
		}, 3000);

		const timer3 = setTimeout(() => {
			setNinStatus("verified");
		}, 4500);

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
			clearTimeout(timer3);
		};
	}, []);

	const getStatusIcon = (status: ReviewStatus) => {
		switch (status) {
			case "verified":
				return (
					<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
						<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
					</div>
				);
			case "verifying":
				return (
					<div className="w-6 h-6 border-2 border-[#014834] rounded-full flex items-center justify-center">
						<div className="w-2 h-2 bg-[#014834] rounded-full animate-pulse" />
					</div>
				);
			default:
				return (
					<div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
				);
		}
	};

	return (
		<div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl max-w-md w-full p-8">
				{/* Rumer Logo */}
				<div className="flex justify-center mb-6">
					<div className="w-16 h-16 bg-[#014834] rounded-full flex items-center justify-center">
						<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
						</svg>
					</div>
				</div>

				{/* Title */}
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Your submission is under review
				</h2>
				<p className="text-gray-600 mb-6">
					Your personal information and address is being reviewed.
				</p>

				{/* Progress Label */}
				<p className="text-sm font-medium text-[#014834] mb-4">Progress</p>

				{/* Progress Steps */}
				<div className="space-y-4 mb-8">
					{/* Personal Information */}
					<div className="flex items-start gap-3">
						{getStatusIcon(personalInfoStatus)}
						<p className="text-gray-700 text-sm">
							Personal Information: Your personal information and Phone number has been verified on NIMC.
						</p>
					</div>

					{/* Connector Line */}
					<div className="ml-3 w-0.5 h-4 bg-gray-200" />

					{/* NIN Verification */}
					<div className="flex items-start gap-3">
						{getStatusIcon(ninStatus)}
						<p className="text-gray-700 text-sm">
							NIN Verification: Your details are being checked and will be verified within 2 minutes.
						</p>
					</div>
				</div>

				{/* Buttons */}
				<div className="flex gap-4">
					<button
						onClick={onCancel}
						className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
					>
						Cancel
					</button>
					<button
						onClick={onContinue}
						className="flex-1 py-3 rounded-xl bg-[#014834] text-white font-medium hover:bg-[#013628] transition-all"
					>
						Continue
					</button>
				</div>
			</div>
		</div>
	);
};

export default SubmissionReview;
