"use client";

import React, { useEffect } from "react";
import { Check } from "lucide-react";

interface SuccessModalProps {
	onAddStock: () => void;
}

const SuccessModal = ({ onAddStock }: SuccessModalProps) => {
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, []);

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center" role="dialog" aria-modal="true">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onAddStock} />

			{/* Modal */}
			<div className="relative bg-white rounded-2xl p-10 max-w-md w-full mx-4 text-center shadow-2xl">
				{/* Success Icon */}
				<div className="w-16 h-16 bg-[#014834] rounded-full flex items-center justify-center mx-auto mb-6">
					<Check className="w-8 h-8 text-white" />
				</div>

				<h2 className="text-2xl font-bold text-gray-900 mb-3">
					Product Created
				</h2>
				<p className="text-gray-500 mb-8">
					You can now add inventory for this product.
				</p>

				<button
					onClick={onAddStock}
					className="px-8 py-3.5 bg-[#014834] text-white rounded-xl font-medium hover:bg-[#013824] transition inline-flex items-center gap-2"
				>
					<span className="text-xl">+</span> Add Stock
				</button>
			</div>
		</div>
	);
};

export default SuccessModal;
