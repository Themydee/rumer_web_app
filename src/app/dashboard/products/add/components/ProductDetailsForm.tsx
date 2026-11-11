"use client";

import React from "react";
import { ProductFormData } from "./AddProductPage";
import { ChevronDown } from "lucide-react";

interface ProductDetailsFormProps {
	formData: ProductFormData;
	onUpdate: (updates: Partial<ProductFormData>) => void;
	onNext: () => void;
	onBack: () => void;
}

const LIVESTOCK_TYPES = [
	"Cattle",
	"Goat",
	"Sheep",
	"Poultry",
	"Fish",
	"Pig",
];

const BREEDS: Record<string, string[]> = {
	Cattle: [
		"White Fulani",
		"Red Bororo",
		"Ndama",
		"Sokoto Gudali",
		"Rahaji",
		"Azawak",
		"Ambala",
		"Bunaji",
		"Keteku",
		"Jereko",
	],
	Goat: [
		"West African Dwarf",
		"Red Sokoto",
		"Sahel",
		"West African Long Leg",
		"Kambawa",
	],
	Sheep: [
		"West African Dwarf Sheep",
		"Balami",
		"Uda",
		"Yakessa",
		"Djallonke",
	],
	Poultry: [
		"Noiler",
		"Amuro",
		"Funke",
		"Nigerian Local Chicken",
		"Broiler",
		"Layer",
	],
	Fish: [
		"Catfish (Clarias gariepinus)",
		"Tilapia (Oreochromis niloticus)",
		"Heterobranchus",
		"Carp",
		"Mackerel",
	],
	Pig: [
		"Large White",
		"Landrace",
		"Duroc",
		"Hampshire",
		"West African Indigenous",
	],
};

const STORAGE_TYPES = ["Frozen", "Dried", "Fresh"];

const HS_CODES: Record<string, string> = {
	Cattle: "010229",
	Goat: "010420",
	Sheep: "010410",
	Poultry: "010599",
	Fish: "030199",
	Pig: "010399",
};

const PROCESSED_CUT_TYPES = [
	"Whole",
	"Half",
	"Quarter",
	"Breast",
	"Thigh",
	"Leg",
	"Shoulder",
	"Ribs",
	"Loin",
	"Fillet",
	"Steak",
	"Mince",
	"Chops",
	"Ground",
];

const ProductDetailsForm = ({
	formData,
	onUpdate,
	onNext,
	onBack,
}: ProductDetailsFormProps) => {
	const isLivestock = formData.productType === "livestock";
	const availableBreeds = BREEDS[formData.livestockType] || [];

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onNext();
	};

	return (
		<div className="max-w-4xl mx-auto">
			<div className="text-center mb-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Define the product specifications
				</h2>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Product Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Product Name <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={formData.productName}
								onChange={(e) => onUpdate({ productName: e.target.value })}
								placeholder="Enter Product Name"
								className="w-full px-4 py-3 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition"
								required
							/>
						</div>

						{/* Livestock Type (Species) */}
						{isLivestock && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Livestock Type (Species){" "}
									<span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<select
										value={formData.livestockType}
										onChange={(e) =>
											onUpdate({
												livestockType: e.target.value,
												cutType: "",
												hsCode: HS_CODES[e.target.value] || "",
											})
										}
										className="w-full px-4 py-3 border border-gray-250 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition bg-white"
										required
									>
										<option value="">Select Livestock Type (Species)</option>
										{LIVESTOCK_TYPES.map((type) => (
											<option key={type} value={type}>
												{type}
											</option>
										))}
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
								</div>
							</div>
						)}

					{/* Breed */}
					{isLivestock && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Breed <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<select
									value={formData.cutType}
									onChange={(e) => onUpdate({ cutType: e.target.value })}
									className="w-full px-4 py-3 border border-gray-250 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition bg-white"
									required
									disabled={!formData.livestockType}
								>
									<option value="">Select Breed</option>
									{availableBreeds.map((breed) => (
										<option key={breed} value={breed}>
											{breed}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
							</div>
						</div>
					)}

					{/* Processed Product Category */}
					{!isLivestock && (
						<>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Category <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<select
										value={formData.cutType}
										onChange={(e) => onUpdate({ cutType: e.target.value })}
										className="w-full px-4 py-3 border border-gray-250 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition bg-white"
										required
									>
										<option value="">Select Category</option>
										<option value="Goat Meat">Goat Meat</option>
										<option value="Beef">Beef</option>
										<option value="Chicken">Chicken</option>
										<option value="Fish">Fish</option>
										<option value="Mutton">Mutton</option>
										<option value="Pork">Pork</option>
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Cut Type <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<select
										value={formData.processedCutType}
										onChange={(e) => onUpdate({ processedCutType: e.target.value })}
										className="w-full px-4 py-3 border border-gray-250 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition bg-white"
										required
									>
										<option value="">Select Cut Type</option>
										{PROCESSED_CUT_TYPES.map((cut) => (
											<option key={cut} value={cut}>
												{cut}
											</option>
										))}
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
								</div>
							</div>
						</>
					)}

						{/* Unit Size */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Unit Size <span className="text-red-500">*</span>
							</label>
							<div className="flex">
								<input
									type="number"
									value={formData.unitSize}
									onChange={(e) => onUpdate({ unitSize: e.target.value })}
									placeholder="Enter size e.g 1"
									className="flex-1 px-4 py-3 border border-gray-250 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition"
									required
									min="0"
									step="0.1"
								/>
								<div className="flex border border-gray-200 rounded-r-xl overflow-hidden">
									<button
										type="button"
										onClick={() => onUpdate({ unitMeasure: "Kg" })}
										className={`px-4 py-3 text-sm font-medium transition ${
											formData.unitMeasure === "Kg"
												? "bg-gray-900 text-white"
												: "bg-gray-100 text-gray-600 hover:bg-gray-200"
										}`}
									>
										Kg
									</button>
									<button
										type="button"
										onClick={() => onUpdate({ unitMeasure: "Pack" })}
										className={`px-4 py-3 text-sm font-medium transition ${
											formData.unitMeasure === "Pack"
												? "bg-gray-900 text-white"
												: "bg-gray-100 text-gray-600 hover:bg-gray-200"
										}`}
									>
										Pack
									</button>
								</div>
							</div>
						</div>

						{/* Age (Livestock) or Storage Type (Processed) */}
						{isLivestock ? (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Age (months) <span className="text-red-500">*</span>
								</label>
								<input
									type="number"
									value={formData.age}
									onChange={(e) => onUpdate({ age: e.target.value })}
									placeholder="Enter age in months"
									className="w-full px-4 py-3 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition"
									required
									min="0"
								/>
							</div>
						) : (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Storage Type <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<select
										value={formData.storageType}
										onChange={(e) => onUpdate({ storageType: e.target.value })}
										className="w-full px-4 py-3 border border-gray-250 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition bg-white"
										required
									>
										<option value="">Select Frozen, Dried, Fresh</option>
										{STORAGE_TYPES.map((type) => (
											<option key={type} value={type}>
												{type}
											</option>
										))}
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
								</div>
							</div>
						)}

						{/* HS Code */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								HS Code
							</label>
							<input
								type="text"
								value={formData.hsCode}
								readOnly
								placeholder="Auto-populated"
								className="w-full px-4 py-3 border border-gray-250 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
						{/* Base Price */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Base Price (₦) <span className="text-red-500">*</span>
							</label>
							<input
								type="number"
								value={formData.basePrice}
								onChange={(e) => onUpdate({ basePrice: e.target.value })}
								placeholder="Enter Amount"
								className="w-full px-4 py-3 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition"
								required
								min="0"
							/>
							<p className="text-xs text-gray-400 mt-1">
								Suggested price per kg. Can be adjusted per inventory batch.
							</p>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Description <span className="text-red-500">*</span>
							</label>
							<textarea
								value={formData.description}
								onChange={(e) =>
									onUpdate({
										description: e.target.value.slice(0, 200),
									})
								}
								placeholder="Enter Description"
								rows={4}
								className="w-full px-4 py-3 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition resize-none"
								required
							/>
							<p className="text-xs text-gray-400 text-right">
								{formData.description.length}/200
							</p>
						</div>
					</div>
				</div>

				{/* Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 mt-8">
					<button
						type="button"
						onClick={onBack}
						className="px-8 py-3.5 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition flex-1 sm:flex-none"
					>
						Back
					</button>
					<button
						type="submit"
						className="px-8 py-3.5 bg-[#014834] text-white rounded-xl font-medium hover:bg-[#013824] transition flex-1 sm:flex-none"
					>
						Continue
					</button>
				</div>
			</form>
		</div>
	);
};

export default ProductDetailsForm;
