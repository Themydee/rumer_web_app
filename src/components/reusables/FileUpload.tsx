"use client";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

const FileUpload = () => {
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setUploadedFile(e.target.files[0]);
		}
	};

	const handleRemoveFile = () => {
		setUploadedFile(null);
	};

	return (
		<div className='space-y-2'>
			<label className='block text-white text-sm font-medium'>
				Upload Document
			</label>

			{!uploadedFile ? (
				<label className='w-full flex items-center justify-center px-4 py-6 sm:py-10 text-xs sm:text-sm border-2 border-dashed border-zinc-700 rounded-md text-white/60 cursor-pointer hover:border-zinc-500 transition'>
					<input
						type='file'
						accept='.pdf,.doc,.docx'
						onChange={handleFileChange}
						className='hidden'
					/>
					Click to upload a file
				</label>
			) : (
				<div className='flex items-center justify-between px-2 sm:px-4 py-3 sm:py-4 border border-zinc-700 rounded-md bg-zinc-900/30 text-white'>
					<div className='flex items-start gap-2 sm:gap-3'>
						<FaCheckCircle className='text-green-500 mt-1' size={20} />
						<div>
							<p className='font-semibold text-sm'>Upload Successful</p>
							<p className='text-xxs sm:text-xs text-white/70'>
								{uploadedFile.name} • {(uploadedFile.size / 1024).toFixed(0)} KB
								•{" "}
								{new Date().toLocaleDateString("en-GB", {
									day: "2-digit",
									month: "short",
									year: "numeric",
								})}
							</p>
						</div>
					</div>
					<button
						onClick={handleRemoveFile}
						className='text-white/70 hover:text-red-500 transition'
					>
						<FiTrash2 size={18} />
					</button>
				</div>
			)}
		</div>
	);
};

export default FileUpload;
