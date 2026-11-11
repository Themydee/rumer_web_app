"use client";
import React, { useState } from "react";
import CoopLayout from "./CoopLayout";

interface Officer {
	fullName: string;
	role: string;
	phone: string;
	email: string;
}

interface ElectedOfficersProps {
	formData: { officers: Officer[] };
	onNext: (data: { officers: Officer[] }) => void;
	onBack: () => void;
}

const emptyOfficer: Officer = { fullName: "", role: "", phone: "", email: "" };

const inputClass =
	"w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400";

const ElectedOfficers = ({ formData, onNext, onBack }: ElectedOfficersProps) => {
	const [officers, setOfficers] = useState<Officer[]>(
		formData.officers.length ? formData.officers : [emptyOfficer]
	);

	const updateOfficer = (idx: number, field: keyof Officer, value: string) => {
		setOfficers((prev) =>
			prev.map((o, i) => (i === idx ? { ...o, [field]: value } : o))
		);
	};

	const addOfficer = () => setOfficers((prev) => [...prev, emptyOfficer]);

	const removeOfficer = (idx: number) =>
		setOfficers((prev) => prev.filter((_, i) => i !== idx));

	const handleSubmit = () => {
		const valid = officers.filter((o) => o.fullName && o.role && o.phone && o.email);
		onNext({ officers: valid.length ? valid : officers });
	};

	const firstValid = officers[0]?.fullName && officers[0]?.role && officers[0]?.phone && officers[0]?.email;

	return (
		<CoopLayout step={4} total={7} onBack={onBack}>
			<div>
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900 leading-snug">
						Elected Officers
					</h1>
					<p className="text-gray-500 mt-2 text-sm">
						Add the details of your cooperative&apos;s elected executive officers.
					</p>
				</div>

				<div className="space-y-6">
					{officers.map((officer, idx) => (
						<div key={idx} className="p-4 border border-gray-200 rounded-xl space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm font-semibold text-gray-700">
									Officer {idx + 1}
								</span>
								{officers.length > 1 && (
									<button
										type="button"
										onClick={() => removeOfficer(idx)}
										className="text-xs text-red-500 hover:underline"
									>
										Remove
									</button>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
								<input
									type="text"
									placeholder="Enter full name"
									value={officer.fullName}
									onChange={(e) => updateOfficer(idx, "fullName", e.target.value)}
									className={inputClass}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
									<input
										type="text"
										placeholder="e.g. Chairman"
										value={officer.role}
										onChange={(e) => updateOfficer(idx, "role", e.target.value)}
										className={inputClass}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
									<input
										type="tel"
										placeholder="Phone number"
										value={officer.phone}
										onChange={(e) => updateOfficer(idx, "phone", e.target.value)}
										className={inputClass}
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
								<input
									type="email"
									placeholder="Email address"
									value={officer.email}
									onChange={(e) => updateOfficer(idx, "email", e.target.value)}
									className={inputClass}
								/>
							</div>
						</div>
					))}

					<button
						type="button"
						onClick={addOfficer}
						className="w-full py-3 rounded-xl border border-dashed border-gray-300 text-[#014834] font-medium hover:border-[#014834] transition-colors"
					>
						+ Add Officers
					</button>

					<div className="pt-2">
						<button
							onClick={handleSubmit}
							disabled={!firstValid}
							className="w-full py-4 rounded-2xl bg-[#014834] text-white text-base font-semibold hover:bg-[#013628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Continue
						</button>
					</div>
				</div>
			</div>
		</CoopLayout>
	);
};

export default ElectedOfficers;
