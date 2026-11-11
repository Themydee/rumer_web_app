"use client";

import React from "react";

interface FilterTabsProps {
	activeFilter: "all" | "livestock" | "processed";
	onFilterChange: (filter: "all" | "livestock" | "processed") => void;
	counts: {
		all: number;
		livestock: number;
		processed: number;
	};
}

const FilterTabs = ({ activeFilter, onFilterChange, counts }: FilterTabsProps) => {
	const tabs = [
		{ key: "all" as const, label: "All", count: counts.all },
		{ key: "livestock" as const, label: "Livestock", count: counts.livestock },
		{ key: "processed" as const, label: "Processed", count: counts.processed },
	];

	return (
		<div className="flex items-center gap-2">
			{tabs.map((tab) => (
				<button
					key={tab.key}
					onClick={() => onFilterChange(tab.key)}
					className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
						activeFilter === tab.key
							? "bg-[#014834] text-white"
							: "bg-gray-100 text-gray-600 hover:bg-gray-200"
					}`}
				>
					{tab.label}
					<span
						className={`text-xs px-1.5 py-0.5 rounded-full ${
							activeFilter === tab.key
								? "bg-white/20 text-white"
								: "bg-gray-200 text-gray-500"
						}`}
					>
						{tab.count}
					</span>
				</button>
			))}
		</div>
	);
};

export default FilterTabs;
