"use client";
import React from "react";

interface SubmittingVerificationProps {
	onContinue: () => void;
	onBackToDashboard: () => void;
}

const SubmittingVerification = ({ onContinue, onBackToDashboard }: SubmittingVerificationProps) => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
			{/* Rumer Logo */}
			<div className="flex items-center gap-2 mb-10">
				<div className="w-12 h-12 bg-[#014834] rounded-full flex items-center justify-center">
					<span className="text-white text-2xl font-bold">R</span>
				</div>
				<span className="text-3xl font-bold text-gray-900">Rumer</span>
			</div>

			{/* Spinner */}
			<div className="w-12 h-12 border-4 border-gray-200 border-t-[#014834] rounded-full animate-spin mb-6" />

			<h1 className="text-2xl font-bold text-gray-900 mb-2">Submitting for verification...</h1>
			<p className="text-gray-500 text-center max-w-sm mb-10">
				Please wait while we securely submit your cooperative details for verification.
			</p>

			<div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
				<button
					onClick={onBackToDashboard}
					className="w-full py-4 rounded-2xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
				>
					Back to Dashboard
				</button>
				<button
					onClick={onContinue}
					className="w-full py-4 rounded-2xl bg-[#014834] text-white font-semibold hover:bg-[#013628] transition-all"
				>
					Continue
				</button>
			</div>
		</div>
	);
};

export default SubmittingVerification;
