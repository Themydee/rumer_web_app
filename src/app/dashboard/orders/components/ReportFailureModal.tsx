"use client";

import React, { useState } from "react";
import { AlertCircle, X, Camera, MapPin, Clock } from "lucide-react";

interface ReportFailureModalProps {
	isOpen: boolean;
	order: {
		id: string;
		order_id: string;
		product_name: string;
		seller_id?: string;
	} | null;
	userRole: "seller" | "assessor";
	userId: string;
	onClose: () => void;
	onSuccess: () => void;
}

export default function ReportFailureModal({
	isOpen,
	order,
	userRole,
	userId,
	onClose,
	onSuccess,
}: ReportFailureModalProps) {
	const [failureType, setFailureType] = useState<string>("seller_failed_supply");
	const [isSellerFault, setIsSellerFault] = useState<boolean>(true);
	const [notes, setNotes] = useState("");
	const [loading, setLoading] = useState(false);
	const [gpsLocating, setGpsLocating] = useState(false);
	const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
	const [error, setError] = useState<string | null>(null);

	if (!isOpen || !order) return null;

	const handleCaptureGps = () => {
		if (!navigator.geolocation) {
			setError("Geolocation is not supported by your browser.");
			return;
		}
		setGpsLocating(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setGpsCoords({
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				});
				setGpsLocating(false);
			},
			(err) => {
				console.error("GPS capture error:", err);
				setError("Could not retrieve GPS location. Please enable location services.");
				setGpsLocating(false);
			}
		);
	};

	const handleSubmitFailure = async () => {
		if (!notes.trim()) {
			setError("Please state the reason/notes for this order failure.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			// If assessor, update GPS first
			if (userRole === "assessor" && gpsCoords) {
				await fetch("/api/assessor/location", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						assessor_id: userId,
						order_id: order.id,
						latitude: gpsCoords.lat,
						longitude: gpsCoords.lng,
					}),
				});
			}

			const endpoint =
				userRole === "assessor"
					? `/api/orders/${order.id}/quality-check`
					: `/api/orders/${order.id}/fail`;

			const bodyData =
				userRole === "assessor"
					? {
							assessor_id: userId,
							passed: false,
							is_seller_fault: isSellerFault,
							notes,
					  }
					: {
							seller_id: userId,
							failure_reason: notes,
					  };

			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(bodyData),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to process order failure");
			}

			onSuccess();
			onClose();
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
				{/* Header */}
				<div className="flex items-center justify-between pb-4 border-b border-gray-100">
					<div className="flex items-center gap-2">
						<AlertCircle className="w-5 h-5 text-amber-600" />
						<h3 className="text-lg font-bold text-gray-900">Report Order Failure</h3>
					</div>
					<button
						onClick={onClose}
						className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Order Summary */}
				<div className="my-4 p-4 bg-amber-50/50 rounded-xl border border-amber-200">
					<p className="text-xs text-amber-800 font-semibold uppercase tracking-wider">
						Order #{order.order_id}
					</p>
					<p className="text-base font-bold text-gray-900 mt-1">{order.product_name}</p>
				</div>

				{/* Assessor Fault Selector */}
				{userRole === "assessor" && (
					<div className="mb-4">
						<label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
							Failure Classification
						</label>
						<div className="grid grid-cols-2 gap-2">
							<button
								type="button"
								onClick={() => setIsSellerFault(true)}
								className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition ${
									isSellerFault
										? "bg-red-50 border-red-500 text-red-700"
										: "bg-white border-gray-200 text-gray-600"
								}`}
							>
								Seller/Cooperative Fault (₦3k Penalty + Strike)
							</button>
							<button
								type="button"
								onClick={() => setIsSellerFault(false)}
								className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition ${
									!isSellerFault
										? "bg-blue-50 border-blue-500 text-blue-700"
										: "bg-white border-gray-200 text-gray-600"
								}`}
							>
								Unavoidable Natural Cause (No Penalty)
							</button>
						</div>
					</div>
				)}

				{/* Real-time GPS Capture for Assessor Protection */}
				{userRole === "assessor" && (
					<div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<MapPin className="w-4 h-4 text-[#014834]" />
							<span className="text-xs font-semibold text-gray-700">
								{gpsCoords
									? `GPS Locked: ${gpsCoords.lat.toFixed(4)}, ${gpsCoords.lng.toFixed(4)}`
									: "Assessor Location Verification"}
							</span>
						</div>
						<button
							type="button"
							onClick={handleCaptureGps}
							disabled={gpsLocating}
							className="px-3 py-1.5 bg-[#014834] text-white text-xs font-bold rounded-lg hover:bg-[#013824] transition disabled:opacity-50"
						>
							{gpsLocating ? "Locating..." : gpsCoords ? "Re-verify" : "Verify GPS"}
						</button>
					</div>
				)}

				{/* Notes Input */}
				<div className="mb-4">
					<label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
						Detailed Inspection / Failure Notes <span className="text-red-500">*</span>
					</label>
					<textarea
						rows={3}
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Explain why the order cannot be fulfilled or rejected..."
						className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#014834] transition text-gray-900 placeholder:text-gray-400"
					/>
				</div>

				{error && <p className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg">{error}</p>}

				{/* Actions */}
				<div className="flex items-center gap-3 pt-2">
					<button
						type="button"
						onClick={onClose}
						disabled={loading}
						className="flex-1 py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleSubmitFailure}
						disabled={loading}
						className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
					>
						{loading ? (
							<>
								<Clock className="w-4 h-4 animate-spin" />
								<span>Submitting...</span>
							</>
						) : (
							<span>Submit Failure Report</span>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
