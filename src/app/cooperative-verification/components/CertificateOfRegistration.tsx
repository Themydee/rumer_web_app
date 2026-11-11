"use client";
import React, { useState } from "react";
import CoopLayout from "./CoopLayout";
import FileUpload from "./FileUpload";

interface CertificateOfRegistrationProps {
	formData: {
		cooperativeName: string;
		certificateFile: File | null;
	};
	onNext: (data: { cooperativeName: string; certificateFile: File | null }) => void;
	onBack: () => void;
}

const CertificateOfRegistration = ({ formData, onNext, onBack }: CertificateOfRegistrationProps) => {
	const [cooperativeName, setCooperativeName] = useState(formData.cooperativeName);
	const [certificateFile, setCertificateFile] = useState<File | null>(formData.certificateFile);

	const handleSubmit = () => {
		onNext({ cooperativeName, certificateFile });
	};

	return (
		<CoopLayout step={1} total={7} onBack={onBack}>
			<div>
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900 leading-snug">
						Certificate of Registration
					</h1>
					<p className="text-gray-500 mt-2 text-sm">
						Enter your registered cooperative name and upload your certificate of registration.
					</p>
				</div>

				<div className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Cooperative Name
						</label>
						<input
							type="text"
							placeholder="Enter cooperative name"
							value={cooperativeName}
							onChange={(e) => setCooperativeName(e.target.value)}
							className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400"
						/>
					</div>

					<FileUpload
						label="Certificate of Registration"
						file={certificateFile}
						onChange={setCertificateFile}
					/>

					<div className="pt-4">
						<button
							onClick={handleSubmit}
							disabled={!cooperativeName || !certificateFile}
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

export default CertificateOfRegistration;
