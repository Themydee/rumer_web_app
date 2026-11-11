"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

interface ConfirmSubmitModalProps {
	open: boolean;
	loading: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

export const ConfirmSubmitModal = ({ open, loading, onCancel, onConfirm }: ConfirmSubmitModalProps) => {
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => { document.body.style.overflow = ""; };
	}, [open]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center" role="dialog" aria-modal="true">
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !loading && onCancel()} />
			<div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 text-center">
				<div className="w-14 h-14 bg-[#014834] rounded-full flex items-center justify-center mx-auto mb-5">
					<Check className="w-7 h-7 text-white" />
				</div>
				<h3 className="text-lg font-bold text-gray-900 mb-2">Submit for Approval</h3>
				<p className="text-sm text-gray-500 mb-8">
					Submit this listing for review? You won&apos;t be able to edit until the review is complete
				</p>
				<div className="flex gap-3 justify-center">
					<button
						onClick={onCancel}
						disabled={loading}
						className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 hover:bg-gray-100 transition disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						disabled={loading}
						className="px-6 py-2.5 bg-[#014834] text-white rounded-xl text-sm font-semibold hover:bg-[#013824] transition disabled:opacity-50"
					>
						{loading ? "Submitting..." : "Submit"}
					</button>
				</div>
			</div>
		</div>
	);
};

interface ConfirmDeleteModalProps {
	open: boolean;
	loading: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

export const ConfirmDeleteModal = ({ open, loading, onCancel, onConfirm }: ConfirmDeleteModalProps) => {
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => { document.body.style.overflow = ""; };
	}, [open]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center" role="dialog" aria-modal="true">
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !loading && onCancel()} />
			<div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 text-center">
				<div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
					<X className="w-7 h-7 text-white" />
				</div>
				<h3 className="text-lg font-bold text-gray-900 mb-2">Delete</h3>
				<p className="text-sm text-gray-500 mb-8">
					Are you sure you want to delete this draft? This action cannot be undone
				</p>
				<div className="flex gap-3 justify-center">
					<button
						onClick={onCancel}
						disabled={loading}
						className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 hover:bg-gray-100 transition disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						disabled={loading}
						className="px-6 py-2.5 bg-[#014834] text-white rounded-xl text-sm font-semibold hover:bg-[#013824] transition disabled:opacity-50"
					>
						{loading ? "Deleting..." : "Delete Draft"}
					</button>
				</div>
			</div>
		</div>
	);
};

interface SubmittedModalProps {
	open: boolean;
	onCancel?: () => void;
}

export const SubmittedModal = ({ open, onCancel }: SubmittedModalProps) => {
	const router = useRouter();

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => { document.body.style.overflow = ""; };
	}, [open]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center" role="dialog" aria-modal="true">
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
			<div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 text-center">
				<div className="w-14 h-14 bg-[#014834] rounded-full flex items-center justify-center mx-auto mb-5">
					<Check className="w-7 h-7 text-white" />
				</div>
				<h3 className="text-lg font-bold text-gray-900 mb-2">Submitted</h3>
				<p className="text-sm text-gray-500 mb-8">
					Your listing is now sent for approval
				</p>
				<div className="flex gap-3 justify-center">
					{onCancel && (
						<button
							onClick={onCancel}
							className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 hover:bg-gray-100 transition"
						>
							Cancel
						</button>
					)}
					<button
						onClick={() => router.push("/dashboard/products/pending")}
						className="px-6 py-2.5 bg-[#014834] text-white rounded-xl text-sm font-semibold hover:bg-[#013824] transition"
					>
						View Listings
					</button>
				</div>
			</div>
		</div>
	);
};

interface DeletedModalProps {
	open: boolean;
}

export const DeletedModal = ({ open }: DeletedModalProps) => {
	const router = useRouter();

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => { document.body.style.overflow = ""; };
	}, [open]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center" role="dialog" aria-modal="true">
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
			<div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 text-center">
				<div className="w-14 h-14 bg-[#014834] rounded-full flex items-center justify-center mx-auto mb-5">
					<Check className="w-7 h-7 text-white" />
				</div>
				<h3 className="text-lg font-bold text-gray-900 mb-2">Deleted</h3>
				<p className="text-sm text-gray-500 mb-8">
					Your listing is now deleted
				</p>
				<div className="flex gap-3 justify-center">
					<button
						onClick={() => router.push("/dashboard/products/drafts")}
						className="px-6 py-2.5 bg-[#014834] text-white rounded-xl text-sm font-semibold hover:bg-[#013824] transition"
					>
						View Listings
					</button>
				</div>
			</div>
		</div>
	);
};
