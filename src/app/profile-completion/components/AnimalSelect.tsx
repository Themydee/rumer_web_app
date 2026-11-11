"use client";
import React, { useState, useRef, useEffect } from "react";

interface AnimalSelectProps {
	selected: string[];
	onChange: (selected: string[]) => void;
}

const animalOptions = [
	{ id: "Cow (Cattle)", label: "Cow (Cattle)" },
	{ id: "Goat", label: "Goat" },
	{ id: "Sheep", label: "Sheep" },
	{ id: "Poultry", label: "Poultry" },
	{ id: "Ruminant", label: "Ram" },
	{ id: "Other", label: "Other" },
];

const AnimalSelect = ({ selected, onChange }: AnimalSelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleToggle = (id: string) => {
		if (selected.includes(id)) {
			onChange(selected.filter((s) => s !== id));
		} else {
			onChange([...selected, id]);
		}
	};

	const handleRemove = (id: string) => {
		onChange(selected.filter((s) => s !== id));
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<div
				onClick={() => setIsOpen(!isOpen)}
				className="w-full px-4 py-3 rounded-xl border border-gray-250 bg-gray-50 cursor-pointer flex items-center justify-between min-h-[48px]"
			>
				<div className="flex flex-wrap gap-2">
					{selected.length === 0 ? (
						<span className="text-gray-400">Select animals</span>
					) : (
						selected.map((id) => {
							const animal = animalOptions.find((a) => a.id === id);
							return (
								<span
									key={id}
									className="inline-flex items-center gap-1 bg-[#014834]/10 text-[#014834] px-3 py-1 rounded-full text-sm font-medium"
								>
									{animal?.label}
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											handleRemove(id);
										}}
										className="ml-1 hover:bg-[#014834]/20 rounded-full p-0.5"
									>
										<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</span>
							);
						})
					)}
				</div>
				<svg
					className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</div>

			{isOpen && (
				<div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
					{animalOptions.map((animal) => {
						const isSelected = selected.includes(animal.id);
						return (
							<div
								key={animal.id}
								onClick={() => handleToggle(animal.id)}
								className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-gray-50 ${
									isSelected ? "bg-[#014834]/5" : ""
								}`}
							>
								<span className="text-gray-700">{animal.label}</span>
								{isSelected && (
									<svg className="w-5 h-5 text-[#014834]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default AnimalSelect;
