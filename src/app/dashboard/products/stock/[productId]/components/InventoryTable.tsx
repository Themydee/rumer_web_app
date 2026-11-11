"use client";

import React, { useState, useEffect } from "react";
import { Inventory } from "@/components/lib/supabase/database.types";
import { getToken } from "@/components/lib/supabase/auth";
import { ChevronDown, ChevronUp, MoreVertical, MapPin, Eye, Pencil, Archive, X } from "lucide-react";

interface InventoryTableProps {
	inventory: Inventory[];
	onInventoryChange?: (item: Inventory) => void;
	onInventoryRemove?: (id: string) => void;
}

type SortField = "serial_number" | "weight" | "quantity" | "status" | "location" | "created_at";
type SortDir = "asc" | "desc";

const ITEMS_PER_PAGE = 8;

const InventoryTable = ({ inventory, onInventoryChange, onInventoryRemove }: InventoryTableProps) => {
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [sortField, setSortField] = useState<SortField | null>(null);
	const [sortDir, setSortDir] = useState<SortDir>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [openMenu, setOpenMenu] = useState<string | null>(null);
	const [viewItem, setViewItem] = useState<Inventory | null>(null);
	const [editItem, setEditItem] = useState<Inventory | null>(null);
	const [editForm, setEditForm] = useState({ weight: "", quantity: "", status: "", state: "", lga: "", town: "" });
	const [editSaving, setEditSaving] = useState(false);
	const [archiveItem, setArchiveItem] = useState<Inventory | null>(null);
	const [archiving, setArchiving] = useState(false);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (!(e.target as HTMLElement).closest("[data-inventory-menu]")) {
				setOpenMenu(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const openEdit = (item: Inventory) => {
		setEditItem(item);
		setEditForm({
			weight: item.weight?.toString() || "",
			quantity: item.quantity?.toString() || "1",
			status: item.status,
			state: item.state || "",
			lga: item.lga || "",
			town: item.town || "",
		});
	};

	const handleSaveEdit = async () => {
		if (!editItem) return;
		setEditSaving(true);
		const token = getToken();
		try {
			const res = await fetch(`/api/inventory/${editItem.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					weight: editForm.weight || undefined,
					quantity: editForm.quantity || undefined,
					status: editForm.status || undefined,
					state: editForm.state || undefined,
					lga: editForm.lga || undefined,
					town: editForm.town || undefined,
				}),
			});
			const data = await res.json();
			if (res.ok && data.item) {
				onInventoryChange?.(data.item);
				setEditItem(null);
			}
		} catch {
			// silent
		}
		setEditSaving(false);
	};

	const handleArchive = async () => {
		if (!archiveItem) return;
		setArchiving(true);
		const token = getToken();
		try {
			const res = await fetch(`/api/inventory/${archiveItem.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ status: "archived" }),
			});
			if (res.ok) {
				onInventoryRemove?.(archiveItem.id);
				setArchiveItem(null);
			}
		} catch {
			// silent
		}
		setArchiving(false);
	};

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDir((d) => (d === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortDir("asc");
		}
	};

	const sorted = [...inventory].sort((a, b) => {
		if (!sortField) return 0;
		let aVal: any, bVal: any;
		switch (sortField) {
			case "serial_number":
				aVal = a.serial_number;
				bVal = b.serial_number;
				break;
			case "weight":
				aVal = a.weight || 0;
				bVal = b.weight || 0;
				break;
			case "quantity":
				aVal = a.quantity;
				bVal = b.quantity;
				break;
			case "status":
				aVal = a.status;
				bVal = b.status;
				break;
			case "location":
				aVal = a.state || "";
				bVal = b.state || "";
				break;
			case "created_at":
				aVal = new Date(a.created_at).getTime();
				bVal = new Date(b.created_at).getTime();
				break;
			default:
				return 0;
		}
		if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
		if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
		return 0;
	});

	const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
	const paginated = sorted.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	const toggleSelectAll = () => {
		if (selected.size === paginated.length) {
			setSelected(new Set());
		} else {
			setSelected(new Set(paginated.map((item) => item.id)));
		}
	};

	const toggleSelect = (id: string) => {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const year = date.getFullYear().toString().slice(-2);
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		return `${day}.${month}.${year} ${hours}:${minutes} pm`;
	};

	const SortIcon = ({ field }: { field: SortField }) => {
		if (sortField !== field) return <ChevronDown className="w-3.5 h-3.5 text-gray-300" />;
		return sortDir === "asc" ? (
			<ChevronUp className="w-3.5 h-3.5 text-gray-600" />
		) : (
			<ChevronDown className="w-3.5 h-3.5 text-gray-600" />
		);
	};

	if (inventory.length === 0) {
		return (
			<div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
				<p className="text-gray-500">No inventory items yet. Add stock to get started.</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
			<div>
				<table className="w-full">
					<thead>
						<tr className="border-b border-gray-100">
							<th className="p-4 text-left">
								<input
									type="checkbox"
									checked={selected.size === paginated.length && paginated.length > 0}
									onChange={toggleSelectAll}
									className="w-4 h-4 rounded border-gray-300 text-[#014834] focus:ring-[#014834]"
								/>
							</th>
							<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Inventory ID
							</th>
							<th
								onClick={() => handleSort("serial_number")}
								className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
							>
								<div className="flex items-center gap-1">
									Serial Number
									<SortIcon field="serial_number" />
								</div>
							</th>
							<th
								onClick={() => handleSort("weight")}
								className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
							>
								<div className="flex items-center gap-1">
									Weight
									<SortIcon field="weight" />
								</div>
							</th>
							<th
								onClick={() => handleSort("quantity")}
								className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
							>
								<div className="flex items-center gap-1">
									Quantity
									<SortIcon field="quantity" />
								</div>
							</th>
							<th
								onClick={() => handleSort("status")}
								className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
							>
								<div className="flex items-center gap-1">
									Status
									<SortIcon field="status" />
								</div>
							</th>
							<th
								onClick={() => handleSort("location")}
								className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
							>
								<div className="flex items-center gap-1">
									Location
									<SortIcon field="location" />
								</div>
							</th>
							<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Date Added
							</th>
							<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{paginated.map((item) => (
							<tr
								key={item.id}
								className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${
									selected.has(item.id) ? "bg-[#014834]/5" : ""
								}`}
							>
								<td className="p-4">
									<input
										type="checkbox"
										checked={selected.has(item.id)}
										onChange={() => toggleSelect(item.id)}
										className="w-4 h-4 rounded border-gray-300 text-[#014834] focus:ring-[#014834]"
									/>
								</td>
								<td className="p-4">
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
											<svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
												<circle cx="10" cy="10" r="8" stroke="#014834" strokeWidth="1.5" fill="none" />
												<circle cx="7" cy="8" r="1" fill="#014834" />
												<circle cx="13" cy="8" r="1" fill="#014834" />
											</svg>
										</div>
										<span className="text-sm font-medium text-gray-900">
											#{item.id.slice(0, 3).toUpperCase()}
										</span>
									</div>
								</td>
								<td className="p-4 text-sm text-gray-700 font-mono">
									{item.serial_number}
								</td>
								<td className="p-4 text-sm text-gray-700">
									{item.weight ? `${item.weight}kg` : "-"}
								</td>
								<td className="p-4">
									<span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
										{item.quantity}
									</span>
								</td>
								<td className="p-4">
									<span className="flex items-center gap-1.5 text-sm">
										<span className={`w-2 h-2 rounded-full ${
											item.status === "available"
												? "bg-green-500"
												: item.status === "reserved"
												? "bg-yellow-500"
												: "bg-gray-400"
										}`} />
										<span className="capitalize text-gray-700">{item.status}</span>
									</span>
								</td>
								<td className="p-4">
									{item.state ? (
										<span className="flex items-center gap-1 text-sm text-green-700 bg-green-50 px-2 py-1 rounded-full">
											<MapPin className="w-3 h-3" />
											{item.state}
										</span>
									) : (
										<span className="text-sm text-gray-400">-</span>
									)}
								</td>
								<td className="p-4 text-sm text-gray-500">
									{formatDate(item.created_at)}
								</td>
							<td className="p-4">
								<div className="relative" data-inventory-menu>
									<button
										onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)}
										className="p-1.5 hover:bg-gray-100 rounded-lg transition"
									>
										<MoreVertical className="w-4 h-4 text-gray-400" />
									</button>
									{openMenu === item.id && (
									<div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1">
										<button
											onClick={() => {
												setOpenMenu(null);
												setViewItem(item);
											}}
											className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-900 font-semibold hover:bg-gray-100 transition"
										>
											<Eye className="w-4 h-4 text-gray-700" />
											View Details
										</button>
										<button
											onClick={() => {
												setOpenMenu(null);
												openEdit(item);
											}}
											className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-900 font-semibold hover:bg-gray-100 transition"
										>
											<Pencil className="w-4 h-4 text-gray-700" />
											Update Details
										</button>
										<div className="border-t border-gray-100 my-1" />
										<button
											onClick={() => {
												setOpenMenu(null);
												setArchiveItem(item);
											}}
											className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 font-semibold hover:bg-red-50 transition"
										>
											<Archive className="w-4 h-4" />
											Archive
										</button>
									</div>
									)}
								</div>
							</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
					<button
						onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
						disabled={currentPage === 1}
						className="p-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-30"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M15 18l-6-6 6-6" />
						</svg>
					</button>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
						<button
							key={page}
							onClick={() => setCurrentPage(page)}
							className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
								page === currentPage
									? "bg-[#014834] text-white"
									: "text-gray-600 hover:bg-gray-100"
							}`}
						>
							{page}
						</button>
					))}
					<button
						onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
						disabled={currentPage === totalPages}
						className="p-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-30"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M9 18l6-6-6-6" />
						</svg>
					</button>
				</div>
			)}

			{/* View Details Modal */}
			{viewItem && (
				<div className="fixed inset-0 z-[9999] flex items-center justify-center" role="dialog" aria-modal="true">
					<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewItem(null)} />
					<div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
						<button
							onClick={() => setViewItem(null)}
							className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg"
						>
							<X className="w-5 h-5 text-gray-400" />
						</button>
						<h3 className="text-lg font-bold text-gray-900 mb-6">Inventory Details</h3>
						<div className="space-y-4">
							<div className="flex justify-between py-2 border-b border-gray-100">
								<span className="text-sm text-gray-500">Inventory ID</span>
								<span className="text-sm font-medium text-gray-900">#{viewItem.id.slice(0, 3).toUpperCase()}</span>
							</div>
							<div className="flex justify-between py-2 border-b border-gray-100">
								<span className="text-sm text-gray-500">Serial Number</span>
								<span className="text-sm font-medium text-gray-900 font-mono">{viewItem.serial_number}</span>
							</div>
							<div className="flex justify-between py-2 border-b border-gray-100">
								<span className="text-sm text-gray-500">Weight</span>
								<span className="text-sm font-medium text-gray-900">{viewItem.weight ? `${viewItem.weight}kg` : "-"}</span>
							</div>
							<div className="flex justify-between py-2 border-b border-gray-100">
								<span className="text-sm text-gray-500">Quantity</span>
								<span className="text-sm font-medium text-gray-900">{viewItem.quantity}</span>
							</div>
							<div className="flex justify-between py-2 border-b border-gray-100">
								<span className="text-sm text-gray-500">Status</span>
								<span className="text-sm font-medium text-gray-900 capitalize">{viewItem.status}</span>
							</div>
							<div className="flex justify-between py-2 border-b border-gray-100">
								<span className="text-sm text-gray-500">Location</span>
								<span className="text-sm font-medium text-gray-900">
									{[viewItem.state, viewItem.lga, viewItem.town].filter(Boolean).join(", ") || "-"}
								</span>
							</div>
							<div className="flex justify-between py-2">
								<span className="text-sm text-gray-500">Date Added</span>
								<span className="text-sm font-medium text-gray-900">{formatDate(viewItem.created_at)}</span>
							</div>
						</div>
						<button
							onClick={() => setViewItem(null)}
							className="w-full mt-6 px-4 py-2.5 bg-[#014834] text-white rounded-xl text-sm font-medium hover:bg-[#013824] transition"
						>
							Close
						</button>
					</div>
				</div>
			)}

			{/* Update Details Modal */}
			{editItem && (
				<div className="fixed inset-0 z-[9999] flex items-center justify-center" role="dialog" aria-modal="true">
					<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !editSaving && setEditItem(null)} />
					<div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
						<button
							onClick={() => !editSaving && setEditItem(null)}
							className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg"
						>
							<X className="w-5 h-5 text-gray-400" />
						</button>
						<h3 className="text-lg font-bold text-gray-900 mb-6">Update Details</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1.5">Weight (kg)</label>
								<input
									type="number"
									value={editForm.weight}
									onChange={(e) => setEditForm((p) => ({ ...p, weight: e.target.value }))}
									className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834]"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
								<input
									type="number"
									value={editForm.quantity}
									onChange={(e) => setEditForm((p) => ({ ...p, quantity: e.target.value }))}
									className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834]"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
								<select
									value={editForm.status}
									onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
									className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834]"
								>
									<option value="available">Available</option>
									<option value="reserved">Reserved</option>
									<option value="sold">Sold</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
								<input
									type="text"
									value={editForm.state}
									onChange={(e) => setEditForm((p) => ({ ...p, state: e.target.value }))}
									className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834]"
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">LGA</label>
									<input
										type="text"
										value={editForm.lga}
										onChange={(e) => setEditForm((p) => ({ ...p, lga: e.target.value }))}
										className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834]"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">Town</label>
									<input
										type="text"
										value={editForm.town}
										onChange={(e) => setEditForm((p) => ({ ...p, town: e.target.value }))}
										className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834]"
									/>
								</div>
							</div>
						</div>
						<div className="flex gap-3 justify-end mt-6">
							<button
								onClick={() => setEditItem(null)}
								disabled={editSaving}
								className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								onClick={handleSaveEdit}
								disabled={editSaving}
								className="px-4 py-2.5 bg-[#014834] text-white rounded-xl text-sm font-medium hover:bg-[#013824] transition disabled:opacity-50"
							>
								{editSaving ? "Saving..." : "Save Changes"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Archive Confirm Modal */}
			{archiveItem && (
				<div className="fixed inset-0 z-[9999] flex items-center justify-center" role="dialog" aria-modal="true">
					<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !archiving && setArchiveItem(null)} />
					<div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 text-center">
						<div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
							<Archive className="w-7 h-7 text-orange-500" />
						</div>
						<h3 className="text-lg font-bold text-gray-900 mb-2">Archive</h3>
						<p className="text-sm text-gray-500 mb-8">
							Archive this inventory item ({archiveItem.serial_number})? It will no longer appear in your stock list.
						</p>
						<div className="flex gap-3 justify-center">
							<button
								onClick={() => setArchiveItem(null)}
								disabled={archiving}
								className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								onClick={handleArchive}
								disabled={archiving}
								className="px-6 py-2.5 bg-[#014834] text-white rounded-xl text-sm font-medium hover:bg-[#013824] transition disabled:opacity-50"
							>
								{archiving ? "Archiving..." : "Archive"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default InventoryTable;
