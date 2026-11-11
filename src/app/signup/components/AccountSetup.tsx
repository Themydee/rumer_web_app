"use client";
import React, { useState } from "react";
import { Button } from "@heroui/react";
import AuthLayout from "./AuthLayout";

interface AccountSetupProps {
	step: 1 | 2;
	formData: any;
	onSubmit: (data: any) => void;
	onBack?: () => void;
}

const livestockOptions = [
	{ id: "Cattle", label: "Cows", emoji: "🐄" },
	{ id: "Goat", label: "Goats", emoji: "🐐" },
	{ id: "Sheep", label: "Sheep", emoji: "🐑" },
	{ id: "Poultry", label: "Chicken", emoji: "🐔" },
	{ id: "Ruminant", label: "Ram", emoji: "🐏" },
	{ id: "Other", label: "Other", emoji: "🐾" },
];

const AccountSetup = ({ step, formData, onSubmit, onBack }: AccountSetupProps) => {
	const [businessType, setBusinessType] = useState(formData.businessType || "");
	const [farmName, setFarmName] = useState(formData.farmName || "");
	const [livestockTypes, setLivestockTypes] = useState<string[]>(formData.livestockTypes || []);
	const [otherLivestock, setOtherLivestock] = useState("");

	const handleLivestockToggle = (type: string) => {
		if (type === "Other") {
			if (livestockTypes.includes("Other")) {
				setLivestockTypes(livestockTypes.filter((t) => t !== "Other"));
				setOtherLivestock("");
			} else {
				setLivestockTypes([...livestockTypes, "Other"]);
			}
		} else {
			if (livestockTypes.includes(type)) {
				setLivestockTypes(livestockTypes.filter((t) => t !== type));
			} else {
				setLivestockTypes([...livestockTypes, type]);
			}
		}
	};

	const handleSubmit = () => {
		if (step === 1) {
			onSubmit({ businessType });
		} else {
			onSubmit({ farmName, livestockTypes });
		}
	};

	if (step === 1) {
		return (
			<AuthLayout showBack onBack={onBack} step={2}>
				<div>
					<div className="mb-6">
						<h1 className="text-2xl font-bold text-gray-900 leading-snug">
							Hey there, Are you selling as an Individual or a Business?
						</h1>
						<p className="text-gray-500 mt-2 text-sm">
							To help us personalise your experience, please tell us more.
						</p>
					</div>

					<div className="space-y-4">
						<button
							onClick={() => setBusinessType("individual")}
							className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
								businessType === "individual"
									? "border-[#014834] bg-[#014834]/5"
									: "border-gray-200 hover:border-gray-300"
							}`}
						>
							<div className="flex items-start justify-between">
								<div className="flex items-start gap-3">
									<div
										className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
											businessType === "individual"
												? "border-[#014834] bg-[#014834]"
												: "border-gray-300"
										}`}
									>
										{businessType === "individual" && (
											<svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
											</svg>
										)}
									</div>
									<div>
										<p className="font-semibold text-gray-900 text-base">Individual / Personal</p>
										<p className="text-sm text-gray-500 mt-1 leading-relaxed">
											Are you a smallholder or casual seller? Choose this if you manage
											1-10 animals, farm part-time, or sell occasionally. No business
											registration is required to start selling.
										</p>
										<div className="mt-3">
											<span className="inline-flex items-center gap-1 text-xs font-medium text-[#014834] bg-[#014834]/10 px-2.5 py-1 rounded-full">
												⚡ Start Selling
											</span>
										</div>
									</div>
								</div>
								<svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
								</svg>
							</div>
						</button>

						<button
							onClick={() => setBusinessType("business")}
							className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
								businessType === "business"
									? "border-[#014834] bg-[#014834]/5"
									: "border-gray-200 hover:border-gray-300"
							}`}
						>
							<div className="flex items-start justify-between">
								<div className="flex items-start gap-3">
									<div
										className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
											businessType === "business"
												? "border-[#014834] bg-[#014834]"
												: "border-gray-300"
										}`}
									>
										{businessType === "business" && (
											<svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
											</svg>
										)}
									</div>
									<div>
										<p className="font-semibold text-gray-900 text-base">Business</p>
										<p className="text-sm text-gray-500 mt-1 leading-relaxed">
											Choose this if you operate a registered farm, cooperative, or large-
											scale livestock business. Business sellers can unlock higher listing
											limits, payments, and premium marketplace features.
										</p>
										<div className="mt-3">
											<span className="inline-flex items-center gap-1 text-xs font-medium text-[#014834] bg-[#014834]/10 px-2.5 py-1 rounded-full">
												⚡ Start Selling
											</span>
										</div>
									</div>
								</div>
								<svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
								</svg>
							</div>
						</button>

						<div className="pt-4">
							<button
								onClick={handleSubmit}
								disabled={!businessType}
								className={`w-full py-4 rounded-2xl text-base font-semibold transition-all ${
									businessType
										? "bg-[#014834] text-white hover:bg-[#013628]"
										: "bg-gray-200 text-gray-500 cursor-not-allowed"
								}`}
							>
								Continue
							</button>
						</div>
					</div>
				</div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout showBack onBack={onBack} step={2}>
			<div>
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900">Welcome, Farmer</h1>
					<p className="text-gray-500 mt-1">
						We help you sell your animals fast and safe.
					</p>
				</div>

				<div className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Farm / Business Name
						</label>
						<input
							type="text"
							placeholder="Enter Business Name"
							value={farmName}
							onChange={(e) => setFarmName(e.target.value)}
							className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-3">
							What types of animals do you breed and sell?
						</label>
						<div className="grid grid-cols-3 gap-3">
							{livestockOptions.map((option) => {
								const isSelected = livestockTypes.includes(option.id);
								return (
									<button
										key={option.id}
										onClick={() => handleLivestockToggle(option.id)}
										className={`relative p-4 rounded-2xl border-2 text-center transition-all ${
											isSelected
												? "border-[#014834] bg-[#014834]/5"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<div
											className={`absolute top-2 left-2 w-5 h-5 rounded border flex items-center justify-center ${
												isSelected
													? "bg-[#014834] border-[#014834]"
													: "border-gray-300 bg-white"
											}`}
										>
											{isSelected && (
												<svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
													<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
												</svg>
											)}
										</div>
										<div className="text-3xl mb-1.5">{option.emoji}</div>
										<span className="text-sm font-medium text-gray-700">{option.label}</span>
									</button>
								);
							})}
						</div>
					</div>

					{livestockTypes.includes("Other") && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								Other Livestock Name (optional)
							</label>
							<input
								type="text"
								placeholder="Enter Other Livestock Name (optional)"
								value={otherLivestock}
								onChange={(e) => setOtherLivestock(e.target.value)}
								className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400"
							/>
						</div>
					)}

					<div className="pt-2">
						<button
							onClick={handleSubmit}
							disabled={!farmName || livestockTypes.length === 0}
							className="w-full py-4 rounded-2xl bg-[#014834] text-white text-base font-semibold hover:bg-[#013628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</AuthLayout>
	);
};

export default AccountSetup;
