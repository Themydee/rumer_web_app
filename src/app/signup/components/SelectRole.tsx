"use client";
import React, { useState } from "react";
import AuthLayout from "./AuthLayout";

interface SelectRoleProps {
	onSubmit: (data: { role: string }) => void;
	onBack?: () => void;
}

const roles = [
	{
		id: "farmer",
		label: "Farmer (Producer)",
		icon: (
			<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
				<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor" />
			</svg>
		),
		description: "Are you a smallholder or casual seller? Choose this if you manage 1-10 animals, farm part-time, or sell occasionally.",
	},
	{
		id: "trader",
		label: "Trader (Buyer)",
		icon: (
			<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
				<path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 3h10v2H7V8zm0 4h10v2H7v-2z" fill="currentColor" />
			</svg>
		),
		description: "Choose this if you buy and resell livestock. Access marketplace features and connect with farmers directly.",
	},
	{
		id: "other",
		label: "Other",
		icon: (
			<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
				<path d="M12 15.5A1.5 1.5 0 0 1 10.5 17 1.5 1.5 0 0 1 12 18.5 1.5 1.5 0 0 1 13.5 17 1.5 1.5 0 0 1 12 15.5zm0-6A1.5 1.5 0 0 1 10.5 11 1.5 1.5 0 0 1 12 12.5 1.5 1.5 0 0 1 13.5 11 1.5 1.5 0 0 1 12 9.5zm0-6A1.5 1.5 0 0 1 10.5 5 1.5 1.5 0 0 1 12 6.5 1.5 1.5 0 0 1 13.5 5 1.5 1.5 0 0 1 12 3.5z" fill="currentColor" />
			</svg>
		),
		description: "None of the above. Select this if you have a different role or are unsure.",
	},
];

const SelectRole = ({ onSubmit, onBack }: SelectRoleProps) => {
	const [selectedRole, setSelectedRole] = useState("");

	const handleSubmit = () => {
		if (selectedRole) {
			onSubmit({ role: selectedRole });
		}
	};

	return (
		<AuthLayout showBack onBack={onBack} step={1}>
			<div>
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900 leading-snug">
						Tell us a bit about you
					</h1>
					<p className="text-gray-500 mt-2 text-sm">
						Choose the account type that matches your role
					</p>
				</div>

				<div className="space-y-3">
					<p className="text-sm font-semibold text-gray-700">What do you do?</p>

					{roles.map((role) => (
						<button
							key={role.id}
							onClick={() => setSelectedRole(role.id)}
							className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
								selectedRole === role.id
									? "border-[#014834] bg-[#014834]/5"
									: "border-gray-200 hover:border-gray-300"
							}`}
						>
							<div className="flex items-start gap-3">
								<div
									className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
										selectedRole === role.id
											? "border-[#014834] bg-[#014834]"
											: "border-gray-300"
									}`}
								>
									{selectedRole === role.id && (
										<svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
										</svg>
									)}
								</div>
								<div className={`p-2 rounded-lg ${selectedRole === role.id ? "text-[#014834]" : "text-gray-500"}`}>
									{role.icon}
								</div>
								<div className="flex-1">
									<p className="font-semibold text-gray-900 text-base">{role.label}</p>
									<p className="text-sm text-gray-500 mt-1 leading-relaxed">{role.description}</p>
								</div>
							</div>
						</button>
					))}
				</div>

				<div className="pt-6">
					<button
						onClick={handleSubmit}
						disabled={!selectedRole}
						className={`w-full py-4 rounded-2xl text-base font-semibold transition-all ${
							selectedRole
								? "bg-[#014834] text-white hover:bg-[#013628]"
								: "bg-gray-200 text-gray-500 cursor-not-allowed"
						}`}
					>
						Continue
					</button>
				</div>
			</div>
		</AuthLayout>
	);
};

export default SelectRole;
