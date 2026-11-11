"use client";
import React, { useState } from "react";
import { updateProfile } from "@/components/lib/supabase/profiles";

interface VerifyPersonalDetailsProps {
	formData: {
		nin: string;
		gender: string;
		dateOfBirth: string;
	};
	onSubmit: (data: any) => void;
	onBack?: () => void;
}

const VerifyPersonalDetails = ({ formData, onSubmit, onBack }: VerifyPersonalDetailsProps) => {
	const [nin, setNin] = useState(formData.nin);
	const [gender, setGender] = useState(formData.gender);
	const [dateOfBirth, setDateOfBirth] = useState(formData.dateOfBirth);
	const [showNinTooltip, setShowNinTooltip] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async () => {
		setSubmitting(true);
		try {
			// Save NIN, gender, DOB to profile
			await updateProfile("", {
				id_number: nin,
				gender: gender,
				date_of_birth: dateOfBirth,
			});

			// Mark profile as verified
			await updateProfile("", { is_verified: true });

			onSubmit({ nin, gender, dateOfBirth });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-2xl mx-auto px-6 py-8">
				{/* Progress bar */}
				<div className="mb-6">
					<div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
						<div className="h-full bg-[#014834] rounded-full" style={{ width: "66.66%" }} />
					</div>
				</div>

				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<button
						onClick={onBack}
						className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<div className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
						<span>Tier 0</span>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</div>
				</div>

				{/* Title */}
				<h1 className="text-3xl font-bold text-gray-900 mb-3">Verify Your Identity</h1>
				<p className="text-gray-600 mb-8 leading-relaxed">
					This information is collected to verify your identity, keep your account
					safe, and help meet legal and regulatory requirements a government-
					issued ID. For more information, review the{" "}
					<a href="/privacy" className="text-[#014834] underline">
						Privacy Policy
					</a>
					.
				</p>

				{/* NIN Field */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-1.5">
						NIN<span className="text-red-500 ml-0.5">*</span>{" "}
						<button
							type="button"
							onClick={() => setShowNinTooltip(!showNinTooltip)}
							className="text-[#014834] font-normal inline-flex items-center gap-1"
						>
							Why
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</button>
					</label>
					{showNinTooltip && (
						<div className="mb-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
							NIN (National Identification Number) is an 11-digit unique number issued by NIMC to identify Nigerian citizens.
						</div>
					)}
					<input
						type="text"
						placeholder="Enter NIN"
						value={nin}
						onChange={(e) => setNin(e.target.value.replace(/\D/g, ""))}
						maxLength={11}
						className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent placeholder-gray-400"
					/>
				</div>

				{/* Gender */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-1.5">
						Gender<span className="text-red-500 ml-0.5">*</span>
					</label>
					<select
						value={gender}
						onChange={(e) => setGender(e.target.value)}
						className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent appearance-none"
					>
						<option value="">Select Gender</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
				</div>

				{/* Date of Birth */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-1.5">
						Date of Birth<span className="text-red-500 ml-0.5">*</span>
					</label>
					<input
						type="date"
						value={dateOfBirth}
						onChange={(e) => setDateOfBirth(e.target.value)}
						max={new Date().toISOString().split("T")[0]}
						className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent"
					/>
				</div>

				{/* Submit Button */}
				<button
					onClick={handleSubmit}
					disabled={!nin || nin.length !== 11 || !gender || !dateOfBirth || submitting}
					className="w-full py-4 rounded-2xl bg-[#014834] text-white text-base font-semibold hover:bg-[#013628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{submitting ? "Submitting..." : "Submit"}
				</button>
			</div>
		</div>
	);
};

export default VerifyPersonalDetails;
