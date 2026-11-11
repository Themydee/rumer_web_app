"use client";
import React, { useState } from "react";
import AuthLayout from "./AuthLayout";

const NIGERIAN_STATES = [
	"Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
	"Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
	"Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nassarawa",
	"Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
	"Yobe", "Zamfara",
];

interface PersonalDetailsFormProps {
	formData: any;
	onSubmit: (data: {
		dateOfBirth: string;
		homeAddress: string;
		flatUnit: string;
		lga: string;
		state: string;
	}) => void;
	onBack?: () => void;
}

const PersonalDetailsForm = ({ formData, onSubmit, onBack }: PersonalDetailsFormProps) => {
	const [dateOfBirth, setDateOfBirth] = useState(formData.dateOfBirth || "");
	const [homeAddress, setHomeAddress] = useState(formData.homeAddress || "");
	const [flatUnit, setFlatUnit] = useState(formData.flatUnit || "");
	const [lga, setLga] = useState(formData.lga || "");
	const [state, setState] = useState(formData.state || "");
	const [showWhyDob, setShowWhyDob] = useState(false);
	const [showWhyAddress, setShowWhyAddress] = useState(false);

	const isFormValid = dateOfBirth && homeAddress && lga && state;

	const handleSubmit = () => {
		if (isFormValid) {
			onSubmit({ dateOfBirth, homeAddress, flatUnit, lga, state });
		}
	};

	const fullName = formData.firstName && formData.lastName
		? `${formData.firstName} ${formData.lastName}`
		: formData.legalFullName || "";

	return (
		<AuthLayout showBack onBack={onBack} step={2}>
			<div>
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900 leading-snug">
						Where are you located?
					</h1>
					<p className="text-gray-500 mt-2 text-sm leading-relaxed">
						This information is collected to verify your identity, keep your account safe, and help meet legal and regulatory requirements. For more information, review the{" "}
						<button className="text-[#014834] font-medium underline hover:text-[#013628]">
							Privacy Policy
						</button>
						.
					</p>
				</div>

				<div className="space-y-5">
					{/* Legal Full Name (read-only) */}
					<div>
						<label className="block text-sm font-semibold text-gray-900 mb-1.5">
							Legal Full Name
						</label>
						<input
							type="text"
							value={fullName}
							readOnly
							className="w-full px-4 py-3 rounded-xl border border-gray-250 bg-gray-50 text-gray-700 cursor-not-allowed"
						/>
					</div>

					{/* Date of Birth */}
					<div>
						<div className="flex items-center gap-2 mb-1.5">
							<label className="text-sm font-semibold text-gray-900">Date of birth</label>
							<div className="relative">
								<button
									onMouseEnter={() => setShowWhyDob(true)}
									onMouseLeave={() => setShowWhyDob(false)}
									onClick={() => setShowWhyDob(!showWhyDob)}
									className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
								>
									Why
									<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
										<circle cx="12" cy="12" r="10" />
										<path d="M12 16v-4m0-4h.01" />
									</svg>
								</button>
								{showWhyDob && (
									<div className="absolute left-0 top-full mt-1 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 w-56 z-50 shadow-lg">
										We need your date of birth to verify your identity and ensure compliance with regulations.
									</div>
								)}
							</div>
						</div>
						<input
							type="date"
							value={dateOfBirth}
							onChange={(e) => setDateOfBirth(e.target.value)}
							placeholder="Select DD / MM / YYYY"
							max={new Date().toISOString().split("T")[0]}
							className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-white placeholder-gray-400 text-gray-900"
						/>
					</div>

					{/* Home Address */}
					<div>
						<div className="flex items-center gap-2 mb-1.5">
							<label className="text-sm font-semibold text-gray-900">Home address</label>
							<div className="relative">
								<button
									onMouseEnter={() => setShowWhyAddress(true)}
									onMouseLeave={() => setShowWhyAddress(false)}
									onClick={() => setShowWhyAddress(!showWhyAddress)}
									className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
								>
									Why
									<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
										<circle cx="12" cy="12" r="10" />
										<path d="M12 16v-4m0-4h.01" />
									</svg>
								</button>
								{showWhyAddress && (
									<div className="absolute left-0 top-full mt-1 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 w-56 z-50 shadow-lg">
										Your address helps us verify your location and connect you with nearby buyers.
									</div>
								)}
							</div>
						</div>
						<div className="relative">
							<input
								type="text"
								placeholder="Enter Street address"
								value={homeAddress}
								onChange={(e) => setHomeAddress(e.target.value)}
								className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-white placeholder-gray-400"
							/>
							<svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
								<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" />
							</svg>
						</div>
					</div>

					{/* Flat/Unit */}
					<div>
						<label className="block text-sm font-semibold text-gray-900 mb-1.5">
							Flat unit/other <span className="text-gray-400 font-normal">(optional)</span>
						</label>
						<input
							type="text"
							placeholder="Enter Flat unit/other"
							value={flatUnit}
							onChange={(e) => setFlatUnit(e.target.value)}
							className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-white placeholder-gray-400"
						/>
					</div>

					{/* LGA */}
					<div>
						<label className="block text-sm font-semibold text-gray-900 mb-1.5">
							LGA
						</label>
						<input
							type="text"
							placeholder="Enter LGA"
							value={lga}
							onChange={(e) => setLga(e.target.value)}
							className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-white placeholder-gray-400"
						/>
					</div>

					{/* State */}
					<div>
						<label className="block text-sm font-semibold text-gray-900 mb-1.5">
							State
						</label>
						<div className="relative">
							<select
								value={state}
								onChange={(e) => setState(e.target.value)}
								className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-white text-gray-900 appearance-none"
							>
								<option value="">Select State</option>
								{NIGERIAN_STATES.map((s) => (
									<option key={s} value={s}>{s}</option>
								))}
							</select>
							<svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
								<path d="M6 9l6 6 6-6" />
							</svg>
						</div>
					</div>

					<div className="pt-2">
						<button
							onClick={handleSubmit}
							disabled={!isFormValid}
							className="w-full py-4 rounded-2xl bg-[#014834] text-white text-base font-semibold hover:bg-[#013628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Continue
						</button>
					</div>
				</div>
			</div>
		</AuthLayout>
	);
};

export default PersonalDetailsForm;
