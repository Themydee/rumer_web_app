"use client";
import React, { useState } from "react";
import CoopLayout from "./CoopLayout";
import FileUpload from "./FileUpload";

interface CooperativeAuthorityProps {
	formData: { authorityFile: File | null };
	onNext: (data: { authorityFile: File | null }) => void;
	onBack: () => void;
}

const CooperativeAuthority = ({ formData, onNext, onBack }: CooperativeAuthorityProps) => {
	const [authorityFile, setAuthorityFile] = useState<File | null>(formData.authorityFile);

	const handleSubmit = () => {
		onNext({ authorityFile });
	};

	return (
		<CoopLayout step={5} total={7} onBack={onBack}>
			<div>
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900 leading-snug">
						Cooperative Authority &amp; Identity
					</h1>
					<p className="text-gray-500 mt-2 text-sm">
						Upload a board resolution or formal letter authorising this verification.
					</p>
				</div>

				<div className="space-y-5">
					<FileUpload
						label="Board Resolution / Formal Letter"
						file={authorityFile}
						onChange={setAuthorityFile}
					/>

					<div className="pt-4">
						<button
							onClick={handleSubmit}
							disabled={!authorityFile}
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

export default CooperativeAuthority;
