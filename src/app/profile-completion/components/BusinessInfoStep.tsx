"use client";
import React, { useState } from "react";
import AuthLayout from "@/app/signup/components/AuthLayout";
import AnimalSelect from "./AnimalSelect";

interface BusinessInfoStepProps {
	formData: {
		businessName: string;
		address: string;
		flatUnit: string;
		lga: string;
		state: string;
		country: string;
		livestockTypes: string[];
	};
	onSubmit: (data: any) => void;
	onBack?: () => void;
}

const nigerianStates = [
	"Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
	"Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
	"Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
	"Kwara", "Lagos", "Nassarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
	"Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
];

const BusinessInfoStep = ({ formData, onSubmit, onBack }: BusinessInfoStepProps) => {
	const [businessName, setBusinessName] = useState(formData.businessName);
	const [address, setAddress] = useState(formData.address);
	const [flatUnit, setFlatUnit] = useState(formData.flatUnit);
	const [lga, setLga] = useState(formData.lga);
	const [state, setState] = useState(formData.state);
	const [country, setCountry] = useState(formData.country || "Nigeria");
	const [livestockTypes, setLivestockTypes] = useState<string[]>(formData.livestockTypes);
	const [showAddressTooltip, setShowAddressTooltip] = useState(false);

	const handleSubmit = () => {
		onSubmit({
			businessName,
			address,
			flatUnit,
			lga,
			state,
			country,
			livestockTypes,
		});
	};

	return (
		<AuthLayout showBack onBack={onBack} step={2}>
			<div>
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900 leading-snug">
						Tell us a bit about you Business
					</h1>
					<p className="text-gray-500 mt-2 text-sm">
						That will help us better account setup for you
					</p>
				</div>

				<div className="space-y-5">
					{/* Business Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Business Name / Farm Name
						</label>
						<input
							type="text"
							placeholder="Enter Business Name / Farm Name"
							value={businessName}
							onChange={(e) => setBusinessName(e.target.value)}
							className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400"
						/>
					</div>

					{/* Home Address */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Home address{" "}
							<button
								type="button"
								onClick={() => setShowAddressTooltip(!showAddressTooltip)}
								className="text-[#014834] font-normal ml-1 inline-flex items-center gap-1"
							>
								Why
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</button>
						</label>
						{showAddressTooltip && (
							<div className="mb-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
								We need your address to verify your location and connect you with nearby buyers.
							</div>
						)}
						<div className="relative">
							<input
								type="text"
								placeholder="Enter Street address"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400 pr-10"
							/>
							<div className="absolute right-3 top-1/2 -translate-y-1/2">
								<svg className="w-5 h-5 text-[#014834]" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
								</svg>
							</div>
						</div>
					</div>

					{/* Flat/Unit and LGA */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								Flat, unit, or other
							</label>
							<input
								type="text"
								placeholder="Enter Flat, unit, or other"
								value={flatUnit}
								onChange={(e) => setFlatUnit(e.target.value)}
								className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								Local Government Area (LGA)
							</label>
							<select
								value={lga}
								onChange={(e) => setLga(e.target.value)}
								className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 text-gray-700 appearance-none"
							>
								<option value="">Select LGA</option>
								{/* LGA options would be populated based on selected state */}
							</select>
						</div>
					</div>

					{/* State and Country */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								State
							</label>
							<select
								value={state}
								onChange={(e) => setState(e.target.value)}
								className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 text-gray-700 appearance-none"
							>
								<option value="">Select State</option>
								{nigerianStates.map((s) => (
									<option key={s} value={s}>{s}</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								Country
							</label>
							<select
								value={country}
								onChange={(e) => setCountry(e.target.value)}
								className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 text-gray-700 appearance-none"
							>
								<option value="Nigeria">Nigeria</option>
								<option value="Ghana">Ghana</option>
								<option value="Kenya">Kenya</option>
							</select>
						</div>
					</div>

					{/* Animal Types */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							What types of animals do you breed and sell?
						</label>
						<AnimalSelect
							selected={livestockTypes}
							onChange={setLivestockTypes}
						/>
					</div>

					{/* Continue Button */}
					<div className="pt-4">
						<button
							onClick={handleSubmit}
							disabled={!businessName || !address || !state || livestockTypes.length === 0}
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

export default BusinessInfoStep;
