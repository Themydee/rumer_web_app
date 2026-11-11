"use client";
import React, { useState } from "react";
import AuthLayout from "./AuthLayout";

interface BuyerDetailsProps {
	onSubmit: (data: { buyerType: string; livestockTypes: string[]; otherLivestock: string }) => void;
	onBack?: () => void;
}

const buyerTypes = [
	{
		id: "personal",
		label: "Personal Buyer",
		icon: (
			<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
				<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" />
			</svg>
		),
		description: "Buy livestock for personal use or small-scale reselling.",
	},
	{
		id: "business",
		label: "Business Buyer",
		icon: (
			<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
				<path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" fill="currentColor" />
			</svg>
		),
		description: "Buy and resell livestock as a registered business.",
	},
];

const livestockOptions = [
	{ id: "Cattle", label: "Cattle", emoji: "🐄" },
	{ id: "Goat", label: "Goat", emoji: "🐐" },
	{ id: "Sheep", label: "Sheep", emoji: "🐑" },
	{ id: "Chicken", label: "Chicken", emoji: "🐔" },
	{ id: "Ram", label: "Ram", emoji: "🐏" },
	{ id: "Other", label: "Other", emoji: "🐂" },
];

const BuyerDetails = ({ onSubmit, onBack }: BuyerDetailsProps) => {
	const [buyerType, setBuyerType] = useState("");
	const [livestockTypes, setLivestockTypes] = useState<string[]>([]);
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

	const isFormValid = buyerType && livestockTypes.length > 0;

	const handleSubmit = () => {
		if (isFormValid) {
			onSubmit({ buyerType, livestockTypes, otherLivestock });
		}
	};

	return (
		<AuthLayout showBack onBack={onBack} step={2}>
			<div>
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900 leading-snug">
						What type of buyer are you?
					</h1>
					<p className="text-gray-500 mt-2 text-sm">
						This helps us tailor your experience.
					</p>
				</div>

				<div className="space-y-5">
					{/* Buyer Type */}
					<div className="space-y-3">
						{buyerTypes.map((type) => (
							<button
								key={type.id}
								onClick={() => setBuyerType(type.id)}
								className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
									buyerType === type.id
										? "border-[#014834] bg-[#014834]/5"
										: "border-gray-200 hover:border-gray-300"
								}`}
							>
								<div className="flex items-start gap-3">
									<div
										className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
											buyerType === type.id
												? "border-[#014834] bg-[#014834]"
												: "border-gray-300"
										}`}
									>
										{buyerType === type.id && (
											<svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
											</svg>
										)}
									</div>
									<div className={`p-2 rounded-lg ${buyerType === type.id ? "text-[#014834]" : "text-gray-500"}`}>
										{type.icon}
									</div>
									<div className="flex-1">
										<p className="font-semibold text-gray-900 text-base">{type.label}</p>
										<p className="text-sm text-gray-500 mt-1 leading-relaxed">{type.description}</p>
									</div>
								</div>
							</button>
						))}
					</div>

					{/* Interested Livestock */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-3">
							What business are you interested in?
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

					{/* Other Livestock Name */}
					{livestockTypes.includes("Other") && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								Other Livestock Name <span className="text-gray-400">(optional)</span>
							</label>
							<input
								type="text"
								placeholder="Enter Other Livestock Name"
								value={otherLivestock}
								onChange={(e) => setOtherLivestock(e.target.value)}
								className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-white placeholder-gray-400"
							/>
						</div>
					)}

					{/* Buy for now info text */}
					<p className="text-sm text-gray-400 text-center">
						Buy for now
					</p>

					{/* Next button */}
					<div className="pt-2">
						<button
							onClick={handleSubmit}
							disabled={!isFormValid}
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

export default BuyerDetails;
