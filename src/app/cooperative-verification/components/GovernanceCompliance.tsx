"use client";
import React, { useState } from "react";
import CoopLayout from "./CoopLayout";
import FileUpload from "./FileUpload";

interface GovernanceComplianceProps {
	formData: {
		governanceFile: File | null;
		isEewylaCluster: boolean;
		eewylaFile: File | null;
	};
	onNext: (data: {
		governanceFile: File | null;
		isEewylaCluster: boolean;
		eewylaFile: File | null;
	}) => void;
	onBack: () => void;
}

const GovernanceCompliance = ({ formData, onNext, onBack }: GovernanceComplianceProps) => {
	const [governanceFile, setGovernanceFile] = useState<File | null>(formData.governanceFile);
	const [isEewylaCluster, setIsEewylaCluster] = useState(formData.isEewylaCluster);
	const [eewylaFile, setEewylaFile] = useState<File | null>(formData.eewylaFile);

	const handleSubmit = () => {
		onNext({ governanceFile, isEewylaCluster, eewylaFile });
	};

	return (
		<CoopLayout step={7} total={7} onBack={onBack}>
			<div>
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900 leading-snug">
						Governance &amp; Compliance
					</h1>
					<p className="text-gray-500 mt-2 text-sm">
						Upload your governance rules and confirm your cooperative cluster membership.
					</p>
				</div>

				<div className="space-y-5">
					<FileUpload
						label="Governance Rules Document"
						file={governanceFile}
						onChange={setGovernanceFile}
					/>

					<div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl">
						<input
							type="checkbox"
							id="eewyla"
							checked={isEewylaCluster}
							onChange={(e) => setIsEewylaCluster(e.target.checked)}
							className="mt-1 w-4 h-4 accent-[#014834]"
						/>
						<label htmlFor="eewyla" className="text-sm text-gray-700">
							Our cooperative is part of the EEWYLA cluster verification program.
						</label>
					</div>

					{isEewylaCluster && (
						<FileUpload
							label="EEWYLA Cluster Verification Document"
							file={eewylaFile}
							onChange={setEewylaFile}
						/>
					)}

					<div className="pt-4">
						<button
							onClick={handleSubmit}
							disabled={!governanceFile}
							className="w-full py-4 rounded-2xl bg-[#014834] text-white text-base font-semibold hover:bg-[#013628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Submit for Verification
						</button>
					</div>
				</div>
			</div>
		</CoopLayout>
	);
};

export default GovernanceCompliance;
