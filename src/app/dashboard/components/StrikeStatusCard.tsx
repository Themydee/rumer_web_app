"use client";

import React, { useEffect, useState } from "react";
import { Shield, ShieldAlert, ShieldCheck, Clock, AlertTriangle } from "lucide-react";

interface StrikeStatusCardProps {
	userId: string;
}

export default function StrikeStatusCard({ userId }: StrikeStatusCardProps) {
	const [activeCount, setActiveCount] = useState(0);
	const [confirmTwiceEnabled, setConfirmTwiceEnabled] = useState(false);
	const [isFrozen, setIsFrozen] = useState(false);
	const [freezeUntil, setFreezeUntil] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (userId) {
			fetchStrikes();
		}
	}, [userId]);

	const fetchStrikes = async () => {
		try {
			const res = await fetch(`/api/strikes?userId=${userId}`);
			const data = await res.json();
			if (res.ok) {
				setActiveCount(data.activeCount || 0);
				setConfirmTwiceEnabled(data.confirmTwiceEnabled || false);
				setIsFrozen(data.isFrozen || false);
				setFreezeUntil(data.freezeUntil || null);
			}
		} catch (error) {
			console.error("Failed to fetch strike status:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
				<div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
				<div className="h-6 bg-gray-200 rounded w-1/2"></div>
			</div>
		);
	}

	return (
		<div
			className={`rounded-xl border p-5 transition ${
				isFrozen
					? "bg-red-50 border-red-200"
					: activeCount > 0
					? "bg-amber-50 border-amber-200"
					: "bg-white border-gray-200"
			}`}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div
						className={`w-10 h-10 rounded-lg flex items-center justify-center ${
							isFrozen
								? "bg-red-100 text-red-600"
								: activeCount > 0
								? "bg-amber-100 text-amber-600"
								: "bg-[#014834]/10 text-[#014834]"
						}`}
					>
						{isFrozen ? (
							<AlertTriangle className="w-5 h-5" />
						) : activeCount > 0 ? (
							<ShieldAlert className="w-5 h-5" />
						) : (
							<ShieldCheck className="w-5 h-5" />
						)}
					</div>
					<div>
						<h4 className="text-sm font-bold text-gray-900">
							30-Day Rolling Strike Status
						</h4>
						<p className="text-xs text-gray-500 mt-0.5">
							{activeCount === 0
								? "Clean Standing • 0 Strikes"
								: `${activeCount} Strike${activeCount > 1 ? "s" : ""} active in rolling 30-day window`}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-gray-200">
					<Clock className="w-3.5 h-3.5 text-gray-500" />
					<span>30-Day Window</span>
				</div>
			</div>

			{/* Strike Progress Indicator */}
			<div className="mt-4">
				<div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1.5">
					<span>Active Strikes ({activeCount}/3)</span>
					<span>{3 - activeCount} Strike{3 - activeCount !== 1 ? "s" : ""} remaining</span>
				</div>
				<div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden flex gap-1 p-0.5">
					<div
						className={`h-full rounded-full transition-all ${
							activeCount >= 1 ? "bg-amber-500 w-1/3" : "bg-gray-100 w-1/3"
						}`}
					/>
					<div
						className={`h-full rounded-full transition-all ${
							activeCount >= 2 ? "bg-orange-500 w-1/3" : "bg-gray-100 w-1/3"
						}`}
					/>
					<div
						className={`h-full rounded-full transition-all ${
							activeCount >= 3 ? "bg-red-600 w-1/3" : "bg-gray-100 w-1/3"
						}`}
					/>
				</div>
			</div>

			{/* Active Restrictions Notification */}
			{isFrozen && (
				<div className="mt-3 p-2.5 bg-red-100/80 rounded-lg text-xs text-red-800 font-medium border border-red-200 flex items-center gap-2">
					<AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
					<span>
						Account capability frozen until{" "}
						{freezeUntil ? new Date(freezeUntil).toLocaleString() : "24 hours"} due to 3 active strikes.
					</span>
				</div>
			)}

			{!isFrozen && confirmTwiceEnabled && (
				<div className="mt-3 p-2.5 bg-amber-100/80 rounded-lg text-xs text-amber-900 font-medium border border-amber-200 flex items-center gap-2">
					<Shield className="w-4 h-4 text-amber-700 shrink-0" />
					<span>Double Confirmation Toggle active on your orders (Strike 2 Policy).</span>
				</div>
			)}
		</div>
	);
}
