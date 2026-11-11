"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, ShieldAlert, CheckCircle, RefreshCw, XCircle, Search } from "lucide-react";

interface AdminStrike {
	id: string;
	user_id: string;
	role: string;
	reason: string;
	issued_at: string;
	expires_at: string;
	is_active: boolean;
	profiles?: {
		first_name: string;
		last_name: string;
		phone: string;
		farm_name: string;
	};
}

export default function AdminDisputesPage() {
	const [strikes, setStrikes] = useState<AdminStrike[]>([]);
	const [loading, setLoading] = useState(true);
	const [filterRole, setFilterRole] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		fetchStrikes();
	}, []);

	const fetchStrikes = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/admin/strikes");
			const data = await res.json();
			if (res.ok) {
				setStrikes(data.strikes || []);
			}
		} catch (error) {
			console.error("Failed to fetch admin strikes:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleToggleStrike = async (strikeId: string, currentStatus: boolean) => {
		try {
			const res = await fetch("/api/admin/strikes", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					strike_id: strikeId,
					is_active: !currentStatus,
				}),
			});

			if (res.ok) {
				fetchStrikes();
			}
		} catch (error) {
			console.error("Failed to toggle strike status:", error);
		}
	};

	const filteredStrikes = strikes.filter((s) => {
		const matchesRole = filterRole === "all" || s.role.toLowerCase() === filterRole.toLowerCase();
		const q = searchQuery.toLowerCase();
		const name = `${s.profiles?.first_name || ""} ${s.profiles?.last_name || ""}`.toLowerCase();
		const farm = (s.profiles?.farm_name || "").toLowerCase();
		const reason = s.reason.toLowerCase();
		const matchesSearch = !q || name.includes(q) || farm.includes(q) || reason.includes(q);
		return matchesRole && matchesSearch;
	});

	return (
		<div className="p-6 max-w-7xl mx-auto">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Disputes & Strike Governance</h1>
					<p className="text-gray-500 mt-1">
						Monitor active 30-day rolling strikes, seller penalties, and buyer cancellation enforcement
					</p>
				</div>
				<button
					onClick={fetchStrikes}
					className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 transition shadow-sm"
				>
					<RefreshCw className="w-4 h-4 text-[#014834]" />
					<span>Refresh Data</span>
				</button>
			</div>

			{/* Filter Controls */}
			<div className="flex items-center justify-between gap-4 mb-6">
				<div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 w-72">
					<Search className="w-4 h-4 text-gray-400 mr-2" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search by name, farm or reason..."
						className="w-full text-sm outline-none text-gray-900 placeholder:text-gray-400 bg-transparent"
					/>
				</div>

				<div className="flex bg-white rounded-xl border border-gray-200 p-1">
					{["all", "buyer", "seller", "cooperative"].map((role) => (
						<button
							key={role}
							onClick={() => setFilterRole(role)}
							className={`px-4 py-1.5 text-xs font-bold capitalize rounded-lg transition ${
								filterRole === role
									? "bg-[#014834] text-white"
									: "text-gray-600 hover:text-gray-900"
							}`}
						>
							{role}
						</button>
					))}
				</div>
			</div>

			{/* Strikes Table */}
			<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
				{loading ? (
					<div className="p-12 text-center text-gray-500 text-sm">Loading strikes data...</div>
				) : filteredStrikes.length === 0 ? (
					<div className="p-12 text-center text-gray-500 text-sm">
						No active or historical strikes found.
					</div>
				) : (
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
								<th className="p-4">User Details</th>
								<th className="p-4">Role</th>
								<th className="p-4">Violation Reason</th>
								<th className="p-4">Issued At</th>
								<th className="p-4">Expires (30-Day Window)</th>
								<th className="p-4">Status</th>
								<th className="p-4 text-right">Action</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 text-sm">
							{filteredStrikes.map((s) => (
								<tr key={s.id} className="hover:bg-gray-50/50 transition">
									<td className="p-4">
										<p className="font-bold text-gray-900">
											{s.profiles?.first_name || "User"} {s.profiles?.last_name || ""}
										</p>
										<p className="text-xs text-gray-500">{s.profiles?.phone || s.user_id}</p>
										{s.profiles?.farm_name && (
											<p className="text-xs text-[#014834] font-medium">{s.profiles.farm_name}</p>
										)}
									</td>
									<td className="p-4">
										<span className="capitalize font-semibold text-xs px-2.5 py-1 rounded-md bg-gray-100 text-gray-700">
											{s.role}
										</span>
									</td>
									<td className="p-4 max-w-xs text-xs text-gray-700">{s.reason}</td>
									<td className="p-4 text-xs text-gray-500">
										{new Date(s.issued_at).toLocaleDateString()}
									</td>
									<td className="p-4 text-xs text-gray-500">
										{new Date(s.expires_at).toLocaleDateString()}
									</td>
									<td className="p-4">
										{s.is_active && new Date(s.expires_at) > new Date() ? (
											<span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
												<ShieldAlert className="w-3.5 h-3.5" />
												Active Strike
											</span>
										) : (
											<span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
												<CheckCircle className="w-3.5 h-3.5 text-gray-400" />
												Expired / Revoked
											</span>
										)}
									</td>
									<td className="p-4 text-right">
										<button
											onClick={() => handleToggleStrike(s.id, s.is_active)}
											className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
												s.is_active
													? "border-red-200 text-red-600 hover:bg-red-50"
													: "border-green-200 text-green-700 hover:bg-green-50"
											}`}
										>
											{s.is_active ? "Revoke Strike" : "Re-activate"}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
