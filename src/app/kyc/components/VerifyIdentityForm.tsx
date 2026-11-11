"use client";
import React, { useState, useRef } from "react";
import { updateProfile } from "@/components/lib/supabase/profiles";

interface VerifyIdentityFormProps {
	formData: {
		bvn: string;
		idType: string;
		idFile: File | null;
	};
	onSubmit: (data: { bvn: string; idType: string; idFileUrl?: string }) => void;
	onBack?: () => void;
}

const idTypes = [
	{ value: "nin", label: "NIN" },
	{ value: "passport", label: "Passport" },
	{ value: "drivers_license", label: "Driver's License" },
	{ value: "voters_card", label: "Voter's Card" },
];

const VerifyIdentityForm = ({ formData, onSubmit, onBack }: VerifyIdentityFormProps) => {
	const [bvn, setBvn] = useState(formData.bvn);
	const [idType, setIdType] = useState(formData.idType);
	const [showBvnTooltip, setShowBvnTooltip] = useState(false);
	const [idFile, setIdFile] = useState<File | null>(formData.idFile);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				setUploadError("File must be less than 5 MB");
				return;
			}
			const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
			if (!allowed.includes(file.type)) {
				setUploadError("File must be JPEG, PNG, WebP, or PDF");
				return;
			}
			setIdFile(file);
			setUploadError("");
		}
	};

	const uploadFile = async (): Promise<string | null> => {
		if (!idFile) return null;

		setUploading(true);
		try {
			const formDataObj = new FormData();
			formDataObj.append("file", idFile);

			const response = await fetch("/api/auth/upload-kyc-document", {
				method: "POST",
				body: formDataObj,
			});

			const data = await response.json();
			if (!response.ok) {
				setUploadError(data.error || "Failed to upload file");
				return null;
			}

			return data.url;
		} catch {
			setUploadError("Failed to upload file");
			return null;
		} finally {
			setUploading(false);
		}
	};

	const handleSubmit = async () => {
		// Save BVN and ID type to profile
		await updateProfile("", {
			bvn: bvn,
			id_type: idType as any,
		});

		// Upload file if selected
		let idFileUrl: string | undefined;
		if (idFile) {
			const url = await uploadFile();
			if (url) {
				idFileUrl = url;
				await updateProfile("", { id_file_url: url });
			}
		}

		onSubmit({ bvn, idType, idFileUrl });
	};

	const isFormValid = bvn && bvn.length === 11 && idType && idFile;

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-2xl mx-auto px-6 py-8">
				{/* Progress bar */}
				<div className="mb-6">
					<div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
						<div className="h-full bg-[#014834] rounded-full" style={{ width: "33.33%" }} />
					</div>
				</div>

				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<button
						onClick={onBack}
						className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<div className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
						<span>Tier 0</span>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</div>
				</div>

				{/* Title */}
				<h1 className="text-3xl font-bold text-gray-900 mb-3">Verify Your Identity</h1>
				<p className="text-gray-600 mb-8 leading-relaxed">
					This information is collected to verify your identity, keep your account
					safe, and help meet legal and regulatory requirements a government-
					issued ID. For more information, review the{" "}
					<a href="/privacy" className="text-[#014834] underline">
						Privacy Policy
					</a>
					.
				</p>

				{/* BVN Field */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-1.5">
						BVN<span className="text-red-500 ml-0.5">*</span>{" "}
						<button
							type="button"
							onClick={() => setShowBvnTooltip(!showBvnTooltip)}
							className="text-[#014834] font-normal inline-flex items-center gap-1"
						>
							Why
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</button>
					</label>
					{showBvnTooltip && (
						<div className="mb-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
							BVN (Bank Verification Number) is an 11-digit unique identifier issued by the Central Bank of Nigeria to verify your identity.
						</div>
					)}
					<input
						type="text"
						placeholder="Enter BVN Number"
						value={bvn}
						onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))}
						maxLength={11}
						className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent placeholder-gray-400"
					/>
				</div>

				{/* Government ID Upload */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-1.5">
						Government ID Upload <span className="text-red-500">*</span>
					</label>
					<select
						value={idType}
						onChange={(e) => setIdType(e.target.value)}
						className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent appearance-none"
					>
						<option value="">Select Government ID type</option>
						{idTypes.map((type) => (
							<option key={type.value} value={type.value}>
								{type.label}
							</option>
						))}
					</select>
				</div>

			{/* Upload Method Selection */}
			{idType && (
				<div className="mb-8">
					<p className="text-sm font-medium text-gray-700 mb-3">
						Upload your government ID
					</p>
					<button
						onClick={() => fileInputRef.current?.click()}
						className="w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between border-[#014834] bg-[#014834]/5"
					>
						<div className="flex items-center gap-4">
							<div className="w-5 h-5 rounded-full border-2 border-[#014834] bg-[#014834] flex items-center justify-center">
								<svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
								<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
								</svg>
							</div>
							<div>
								<p className="font-semibold text-gray-900">Upload your document</p>
								<p className="text-sm text-gray-500">
									{idFile ? idFile.name : "PDF format • Max. 5MB"}
								</p>
							</div>
						</div>
						<span className="text-sm font-medium text-[#014834] bg-[#014834]/10 px-4 py-2 rounded-lg">
							Upload
						</span>
					</button>

					<input
						ref={fileInputRef}
						type="file"
						accept=".jpg,.jpeg,.png,.webp,.pdf"
						onChange={handleFileSelect}
						className="hidden"
					/>

					{uploadError && (
						<p className="mt-2 text-sm text-red-600">{uploadError}</p>
					)}
				</div>
			)}

				{/* Submit Button */}
				<button
					onClick={handleSubmit}
					disabled={!isFormValid || uploading}
					className="w-full py-4 rounded-2xl bg-[#014834] text-white text-base font-semibold hover:bg-[#013628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{uploading ? "Uploading..." : "Next"}
				</button>
			</div>
		</div>
	);
};

export default VerifyIdentityForm;
