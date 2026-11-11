"use client";
import React, { useEffect } from "react";

interface VerifyIdModalProps {
	onSubmit: () => void;
	onCancel: () => void;
}

const VerifyIdModal = ({ onSubmit, onCancel }: VerifyIdModalProps) => {
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => { document.body.style.overflow = ""; };
	}, []);

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true">
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
			<div className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
				{/* Rumer Logo */}
				<div className="flex justify-center mb-6">
					<div className="w-16 h-16 bg-[#014834] rounded-full flex items-center justify-center">
						<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
						</svg>
					</div>
				</div>

				{/* Title */}
				<h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
					Verify your identity with Rumer
				</h2>

				{/* Info Points */}
				<div className="space-y-4 mb-8">
					<div className="flex items-start gap-3">
						<div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
							<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</div>
						<p className="text-gray-700">You'll scan a valid photo ID.</p>
					</div>

					<div className="flex items-start gap-3">
						<div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
							<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
						</div>
						<p className="text-gray-700">
							The information you provide Rumer will help us confirm your identity.
						</p>
					</div>

					<div className="flex items-start gap-3">
						<div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
							<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</div>
						<p className="text-gray-700">Rumer will have access to this verification data.</p>
					</div>
				</div>

				{/* Buttons */}
				<div className="flex gap-4">
					<button
						onClick={onCancel}
						className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
					>
						Cancel
					</button>
					<button
						onClick={onSubmit}
						className="flex-1 py-3 rounded-xl bg-[#014834] text-white font-medium hover:bg-[#013628] transition-all"
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
};

export default VerifyIdModal;
