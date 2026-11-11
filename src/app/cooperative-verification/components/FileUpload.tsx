"use client";
import React, { useRef } from "react";

interface FileUploadProps {
	label: string;
	file: File | null;
	onChange: (file: File | null) => void;
	accept?: string;
}

const FileUpload = ({ label, file, onChange, accept = "image/*,.pdf" }: FileUploadProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
			<input
				ref={inputRef}
				type="file"
				accept={accept}
				className="hidden"
				onChange={(e) => onChange(e.target.files?.[0] ?? null)}
			/>
			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				className="w-full flex items-center justify-center gap-3 px-4 py-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#014834] bg-gray-50 text-gray-500 transition-colors"
			>
				<svg className="w-6 h-6 text-[#014834]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
				</svg>
				<span className="text-sm">
					{file ? file.name : "Click to upload document"}
				</span>
			</button>
			{file && (
				<button
					type="button"
					onClick={() => onChange(null)}
					className="mt-1 text-xs text-red-500 hover:underline"
				>
					Remove
				</button>
			)}
		</div>
	);
};

export default FileUpload;
