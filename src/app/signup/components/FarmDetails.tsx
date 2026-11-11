"use client";
import React, { useState } from "react";
import AuthLayout from "./AuthLayout";

interface FarmDetailsProps {
	formData: any;
	onSubmit: (data: { farmName: string; livestockTypes: string[]; otherLivestock: string }) => void;
	onBack?: () => void;
}

const livestockOptions = [
	{ id: "Cattle", label: "Cattle", emoji: "🐄" },
	{ id: "Goat", label: "Goat", emoji: "🐐" },
	{ id: "Sheep", label: "Sheep", emoji: "🐑" },
	{ id: "Chicken", label: "Chicken", emoji: "🐔" },
	{ id: "Ram", label: "Ram", emoji: "🐏" },
	{ id: "Other", label: "Other", emoji: "🐂" },
];

const FarmDetails = ({ formData, onSubmit, onBack }: FarmDetailsProps) => {
	const [farmName, setFarmName] = useState(formData.farmName || "");
	const [livestockTypes, setLivestockTypes] = useState<string[]>(formData.livestockTypes || []);
	const [otherLivestock, setOtherLivestock] = useState(formData.otherLivestock || "");

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
		onSubmit({ farmName, livestockTypes, otherLivestock });
	};

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
							Farm Name <span className="text-gray-400">(optional)</span>
						</label>
						<input
							type="text"
							placeholder="Enter Farm/Business Name"
							value={farmName}
							onChange={(e) => setFarmName(e.target.value)}
							className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-white placeholder-gray-400"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-3">
							Type of Animals You Raise
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

					<div className="pt-2">
						<button
							onClick={handleSubmit}
							disabled={livestockTypes.length === 0}
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

export default FarmDetails;
