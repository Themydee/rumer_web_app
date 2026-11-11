"use client";
import React, { useState } from "react";
import CoopLayout from "./CoopLayout";
import FileUpload from "./FileUpload";

interface CooperativeConstitutionProps {
	formData: { constitutionFile: File | null };
	onNext: (data: { constitutionFile: File | null }) => void;
	onBack: () => void;
}

const CooperativeConstitution = ({ formData, onNext, onBack }: CooperativeConstitutionProps) => {
	const [constitutionFile, setConstitutionFile] = useState<File | null>(formData.constitutionFile);

	const handleSubmit = () => {
		onNext({ constitutionFile });
	};

	return (
		<CoopLayout step={3} total={7} onBack={onBack}>
			<div>
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900 leading-snug">
						Cooperative Constitution
					</h1>
					<p className="text-gray-500 mt-2 text-sm">
						Upload your registered cooperative constitution document.
					</p>
				</div>

				<div className="space-y-5">
					<FileUpload
						label="Constitution Document"
						file={constitutionFile}
						onChange={setConstitutionFile}
					/>

					<div className="pt-4">
						<button
							onClick={handleSubmit}
							disabled={!constitutionFile}
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

export default CooperativeConstitution;
