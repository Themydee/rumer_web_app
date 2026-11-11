"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import {
	ArrowLeft,
	Search,
	Filter,
	MoreVertical,
	Eye,
	Pencil,
	Trash2,
	ChevronLeft,
	ChevronRight,
	BarChart3,
	Shield,
	Truck,
	Clock,
	AlertTriangle,
	ChevronDown,
	X,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
} from "lucide-react";
import { useAppSelector } from "@/components/hooks";
import StrikeStatusCard from "@/app/dashboard/components/StrikeStatusCard";
import CancelOrderModal from "@/app/dashboard/orders/components/CancelOrderModal";
import ReportFailureModal from "@/app/dashboard/orders/components/ReportFailureModal";

interface Order {
	id: string;
	order_id: string;
	product_name: string;
	product_type: string;
	livestock_image: string;
	buyer_name: string;
	buyer_avatar: string;
	quantity: string;
	total_amount: number;
	status: "pending" | "processing" | "completed" | "cancelled" | "published";
	date_created: string;
	created_at: Date;
}

const MOCK_ORDERS: Order[] = [];

const DATE_FILTERS = [
	{ label: "Today", value: "today", days: 0 },
	{ label: "Last 7 Days", value: "7days", days: 7 },
	{ label: "Last 30 Days", value: "30days", days: 30 },
	{ label: "Last 90 Days", value: "90days", days: 90 },
	{ label: "This Year", value: "thisyear", days: 365 },
	{ label: "All Time", value: "all", days: Infinity },
];

const STATUS_FILTERS = [
	{ label: "All Transactions", value: "all" },
	{ label: "Published", value: "published" },
	{ label: "Pending", value: "pending" },
	{ label: "Processing", value: "processing" },
	{ label: "Completed", value: "completed" },
	{ label: "Cancelled", value: "cancelled" },
];

type SortField = "order_id" | "product_name" | "buyer_name" | "total_amount" | "status" | "date_created" | null;
type SortDirection = "asc" | "desc";

const OrdersPage = () => {
	const router = useRouter();
	const { user } = useAppSelector((state) => state.auth);

	const [activeTab, setActiveTab] = useState<"livestock" | "processed">("livestock");
	const [timeFilter, setTimeFilter] = useState<"day" | "month" | "year">("month");
	const [currentPage, setCurrentPage] = useState(1);
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

	const [searchQuery, setSearchQuery] = useState("");
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const [dateFilter, setDateFilter] = useState("30days");
	const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
	const dateDropdownRef = useRef<HTMLDivElement>(null);

	const [statusFilter, setStatusFilter] = useState("all");
	const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
	const statusDropdownRef = useRef<HTMLDivElement>(null);

	const [sortField, setSortField] = useState<SortField>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

	const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
	const [filterType, setFilterType] = useState<string>("all");
	const [filterAmountMin, setFilterAmountMin] = useState("");
	const [filterAmountMax, setFilterAmountMax] = useState("");
	const ITEMS_PER_PAGE = 5;

	const [cancelModalOrder, setCancelModalOrder] = useState<any | null>(null);
	const [failureModalOrder, setFailureModalOrder] = useState<any | null>(null);
	const [ordersList, setOrdersList] = useState<any[]>([]);

	const fetchLiveOrders = async () => {
		try {
			const res = await fetch("/api/orders");
			const data = await res.json();
			if (res.ok && data.orders) {
				setOrdersList(data.orders);
			}
		} catch (error) {
			console.error("Failed to fetch live orders:", error);
		}
	};

	useEffect(() => {
		fetchLiveOrders();
	}, []);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (!(e.target as HTMLElement).closest("[data-order-menu]")) {
				setOpenMenuId(null);
			}
			if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target as Node)) {
				setIsDateDropdownOpen(false);
			}
			if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
				setIsStatusDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (isSearchOpen && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [isSearchOpen]);

	const formatPrice = (price: number) => {
		return `₦${price.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "published":
				return "bg-green-100 text-green-700 border border-green-200";
			case "pending":
				return "bg-orange-100 text-orange-700 border border-orange-200";
			case "processing":
				return "bg-blue-100 text-blue-700 border border-blue-200";
			case "completed":
				return "bg-green-100 text-green-700 border border-green-200";
			case "cancelled":
				return "bg-red-100 text-red-600 border border-red-200";
			default:
				return "bg-gray-100 text-gray-600 border border-gray-200";
		}
	};

	const stats = [
		{
			label: "Completed",
			value: "0",
			change: "0%",
			subtitle: "vs. previous month",
			progress: 0,
			progressColor: "bg-[#014834]",
			icon: BarChart3,
			iconBg: "bg-[#014834]/10",
			iconColor: "text-[#014834]",
		},
		{
			label: "In-Progress",
			value: "0",
			change: "0%",
			subtitle: "vs. previous month",
			progress: 0,
			progressColor: "bg-blue-500",
			icon: Truck,
			iconBg: "bg-blue-50",
			iconColor: "text-blue-500",
		},
		{
			label: "Payment Pending",
			value: "0",
			change: "0%",
			subtitle: "vs. previous month",
			progress: 0,
			progressColor: "bg-orange-400",
			icon: Clock,
			iconBg: "bg-orange-50",
			iconColor: "text-orange-500",
		},
		{
			label: "Dispute",
			value: "0",
			change: "0%",
			subtitle: "vs. previous month",
			progress: 0,
			progressColor: "bg-red-500",
			icon: AlertTriangle,
			iconBg: "bg-red-50",
			iconColor: "text-red-500",
		},
	];

	const filteredOrders = useMemo(() => {
		let result = [...MOCK_ORDERS];

		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(o) =>
					o.order_id.toLowerCase().includes(q) ||
					o.product_name.toLowerCase().includes(q) ||
					o.buyer_name.toLowerCase().includes(q) ||
					o.product_type.toLowerCase().includes(q)
			);
		}

		if (dateFilter !== "all") {
			const filterDef = DATE_FILTERS.find((d) => d.value === dateFilter);
			if (filterDef && filterDef.days !== Infinity) {
				const cutoff = new Date();
				cutoff.setDate(cutoff.getDate() - filterDef.days);
				result = result.filter((o) => o.created_at >= cutoff);
			}
		}

		if (statusFilter !== "all") {
			result = result.filter((o) => o.status === statusFilter);
		}

		if (filterType !== "all") {
			result = result.filter((o) => o.product_type.toLowerCase() === filterType.toLowerCase());
		}

		if (filterAmountMin) {
			const min = parseFloat(filterAmountMin);
			if (!isNaN(min)) {
				result = result.filter((o) => o.total_amount >= min);
			}
		}
		if (filterAmountMax) {
			const max = parseFloat(filterAmountMax);
			if (!isNaN(max)) {
				result = result.filter((o) => o.total_amount <= max);
			}
		}

		if (sortField) {
			result.sort((a, b) => {
				let aVal: any = a[sortField];
				let bVal: any = b[sortField];
				if (sortField === "date_created") {
					aVal = a.created_at.getTime();
					bVal = b.created_at.getTime();
				}
				if (typeof aVal === "string") aVal = aVal.toLowerCase();
				if (typeof bVal === "string") bVal = bVal.toLowerCase();
				if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
				if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
				return 0;
			});
		}

		return result;
	}, [searchQuery, dateFilter, statusFilter, filterType, filterAmountMin, filterAmountMax, sortField, sortDirection]);

	const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
	const paginatedOrders = filteredOrders.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	useEffect(() => {
		if (currentPage > totalPages) setCurrentPage(1);
	}, [totalPages, currentPage]);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const getSortIcon = (field: SortField) => {
		if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
		return sortDirection === "asc" ? (
			<ArrowUp className="w-3 h-3 text-[#014834]" />
		) : (
			<ArrowDown className="w-3 h-3 text-[#014834]" />
		);
	};

	const clearAllFilters = () => {
		setSearchQuery("");
		setDateFilter("30days");
		setStatusFilter("all");
		setFilterType("all");
		setFilterAmountMin("");
		setFilterAmountMax("");
		setSortField(null);
		setCurrentPage(1);
	};

	const hasActiveFilters =
		searchQuery.trim() !== "" ||
		dateFilter !== "30days" ||
		statusFilter !== "all" ||
		filterType !== "all" ||
		filterAmountMin !== "" ||
		filterAmountMax !== "";

	const activeFilterCount = [
		searchQuery.trim() !== "",
		dateFilter !== "30days",
		statusFilter !== "all",
		filterType !== "all",
		filterAmountMin !== "" || filterAmountMax !== "",
	].filter(Boolean).length;

	const toggleSelectAll = () => {
		if (selectedOrders.length === paginatedOrders.length) {
			setSelectedOrders([]);
		} else {
			setSelectedOrders(paginatedOrders.map((o) => o.id));
		}
	};

	const toggleSelectOrder = (id: string) => {
		setSelectedOrders((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
		);
	};

	return (
		<AuthGuard>
			<DashboardLayout>
				<div className="min-h-screen bg-gray-50">
					<div className="max-w-[1400px] mx-auto px-6 py-8">
						{/* Breadcrumb */}
						<div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
							<button
								onClick={() => router.back()}
								className="flex items-center gap-1 hover:text-gray-700 transition"
							>
								<ArrowLeft className="w-4 h-4" />
								<span>Go Back</span>
							</button>
							<span>/</span>
							<button
								onClick={() => router.push("/dashboard")}
								className="hover:text-gray-700 transition"
							>
								Dashboard
							</button>
							<span>/</span>
							<span className="text-gray-900 font-medium">Orders</span>
						</div>

						{/* Header */}
						<div className="flex items-start justify-between mb-8">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">Orders</h1>
								<p className="text-gray-500 mt-1">Track and manage all your sales in one place</p>
							</div>
							<div className="flex items-center gap-3">
								<div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
									{(["day", "month", "year"] as const).map((filter) => (
										<button
											key={filter}
											onClick={() => setTimeFilter(filter)}
											className={`px-5 py-2.5 text-sm font-medium capitalize transition ${
												timeFilter === filter
													? "bg-white text-gray-900 border-b-2 border-[#014834]"
													: "text-gray-500 hover:bg-gray-50"
											}`}
										>
											{filter}
										</button>
									))}
								</div>
								<button className="px-5 py-2.5 border-2 border-gray-300 text-gray-900 font-bold rounded-lg text-sm hover:bg-gray-50 transition">
									Livestocks Listings Feed
								</button>
							</div>
						</div>

						{/* Strike Status Card */}
						{user?.id && (
							<div className="mb-6">
								<StrikeStatusCard userId={String(user.id)} />
							</div>
						)}

						{/* Summary Tabs */}
						<div className="flex bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
							<button
								onClick={() => setActiveTab("livestock")}
								className={`flex-1 py-4 text-center font-semibold transition ${
									activeTab === "livestock"
										? "text-gray-900 border-b-2 border-[#014834]"
										: "text-gray-400 hover:text-gray-600"
								}`}
							>
								Livestock Summary
							</button>
							<button
								onClick={() => setActiveTab("processed")}
								className={`flex-1 py-4 text-center font-semibold transition ${
									activeTab === "processed"
										? "text-gray-900 border-b-2 border-[#014834]"
										: "text-gray-400 hover:text-gray-600"
								}`}
							>
								Processed Product (Red Meat) Summary
							</button>
						</div>

						{/* Green Summary Banner */}
						<div className="bg-[#014834] rounded-2xl p-6 mb-6 flex items-center justify-between">
							<div>
								<p className="text-green-300 text-sm font-medium">All Livestock Worth</p>
								<p className="text-white text-3xl font-bold mt-1">₦0.00</p>
								<div className="flex items-center gap-2 mt-2">
									<Shield className="w-4 h-4 text-green-300" />
									<span className="text-green-200 text-sm">Your funds are secured and insured.</span>
								</div>
							</div>
							<div className="text-right">
								<p className="text-green-300 text-sm font-medium">All Orders</p>
								<p className="text-white text-3xl font-bold mt-1">0</p>
							</div>
							<div className="w-16 h-16 bg-[#0d6b4f] rounded-full flex items-center justify-center">
								<Shield className="w-8 h-8 text-green-300" />
							</div>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-4 gap-4 mb-8">
							{stats.map((stat) => (
								<div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
									<div className="flex items-center justify-between mb-3">
										<span className="text-sm font-semibold text-gray-700">{stat.label}</span>
										<div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
											<stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
										</div>
									</div>
									<div className="flex items-baseline gap-2 mb-1">
										<span className="text-2xl font-bold text-gray-900">{stat.value}</span>
										<span className="text-xs font-semibold text-green-600">{stat.change}</span>
									</div>
									<p className="text-xs text-gray-400 mb-3">{stat.subtitle}</p>
									<div className="flex items-center justify-between text-xs text-gray-400 mb-1">
										<span>0%</span>
										<span className="text-[#014834] font-medium">{stat.progress}%</span>
									</div>
									<div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
										<div
											className={`h-full rounded-full ${stat.progressColor}`}
											style={{ width: `${stat.progress}%` }}
										/>
									</div>
								</div>
							))}
						</div>

						{/* Filter Row */}
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								{/* Search */}
								{isSearchOpen ? (
									<div className="flex items-center bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
										<input
											ref={searchInputRef}
											type="text"
											value={searchQuery}
											onChange={(e) => {
												setSearchQuery(e.target.value);
												setCurrentPage(1);
											}}
											placeholder="Search orders..."
											className="px-3 py-2 text-sm outline-none w-64 text-gray-900 font-medium placeholder:text-gray-400"
										/>
										<button
											onClick={() => {
												setSearchQuery("");
												setIsSearchOpen(false);
												setCurrentPage(1);
											}}
											className="px-3 py-2 text-gray-400 hover:text-gray-600 transition"
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								) : (
									<button
										onClick={() => setIsSearchOpen(true)}
										className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition"
									>
										<Search className="w-5 h-5 text-gray-700" />
									</button>
								)}

								{/* Filters Button */}
								<button
									onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
									className={`flex items-center gap-2 px-4 py-2.5 border-2 font-bold rounded-lg text-sm transition ${
										isFilterPanelOpen || activeFilterCount > 0
											? "border-[#014834] text-[#014834] bg-[#014834]/5"
											: "border-gray-300 text-gray-900 hover:bg-gray-50"
									}`}
								>
									<Filter className="w-4 h-4" />
									Filters
									{activeFilterCount > 0 && (
										<span className="w-5 h-5 bg-[#014834] text-white rounded-full flex items-center justify-center text-xs">
											{activeFilterCount}
										</span>
									)}
								</button>

								{/* Active Filter Tags */}
								{hasActiveFilters && (
									<div className="flex items-center gap-2 ml-2">
										{searchQuery.trim() && (
											<span className="flex items-center gap-1 px-3 py-1 bg-[#014834]/10 text-[#014834] rounded-full text-xs font-medium">
												Search: &ldquo;{searchQuery}&rdquo;
												<button
													onClick={() => {
														setSearchQuery("");
														setCurrentPage(1);
													}}
													className="ml-1 hover:text-[#013828]"
												>
													<X className="w-3 h-3" />
												</button>
											</span>
										)}
										{statusFilter !== "all" && (
											<span className="flex items-center gap-1 px-3 py-1 bg-[#014834]/10 text-[#014834] rounded-full text-xs font-medium">
												{STATUS_FILTERS.find((s) => s.value === statusFilter)?.label}
												<button
													onClick={() => {
														setStatusFilter("all");
														setCurrentPage(1);
													}}
													className="ml-1 hover:text-[#013828]"
												>
													<X className="w-3 h-3" />
												</button>
											</span>
										)}
										{dateFilter !== "30days" && (
											<span className="flex items-center gap-1 px-3 py-1 bg-[#014834]/10 text-[#014834] rounded-full text-xs font-medium">
												{DATE_FILTERS.find((d) => d.value === dateFilter)?.label}
												<button
													onClick={() => {
														setDateFilter("30days");
														setCurrentPage(1);
													}}
													className="ml-1 hover:text-[#013828]"
												>
													<X className="w-3 h-3" />
												</button>
											</span>
										)}
										{filterType !== "all" && (
											<span className="flex items-center gap-1 px-3 py-1 bg-[#014834]/10 text-[#014834] rounded-full text-xs font-medium">
												Type: {filterType}
												<button
													onClick={() => {
														setFilterType("all");
														setCurrentPage(1);
													}}
													className="ml-1 hover:text-[#013828]"
												>
													<X className="w-3 h-3" />
												</button>
											</span>
										)}
										{(filterAmountMin || filterAmountMax) && (
											<span className="flex items-center gap-1 px-3 py-1 bg-[#014834]/10 text-[#014834] rounded-full text-xs font-medium">
												Amount: {filterAmountMin || "0"} - {filterAmountMax || "∞"}
												<button
													onClick={() => {
														setFilterAmountMin("");
														setFilterAmountMax("");
														setCurrentPage(1);
													}}
													className="ml-1 hover:text-[#013828]"
												>
													<X className="w-3 h-3" />
												</button>
											</span>
										)}
										<button
											onClick={clearAllFilters}
											className="text-xs text-gray-500 hover:text-red-600 font-medium transition ml-1"
										>
											Clear all
										</button>
									</div>
								)}
							</div>

							<div className="flex items-center gap-3">
								{/* Date Range Dropdown */}
								<div className="relative" ref={dateDropdownRef}>
									<button
										onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
										className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg text-sm font-semibold transition bg-white ${
											dateFilter !== "30days"
												? "border-[#014834] text-[#014834] bg-[#014834]/5"
												: "border-gray-300 text-gray-900 hover:bg-gray-50"
										}`}
									>
										{DATE_FILTERS.find((d) => d.value === dateFilter)?.label}
										<ChevronDown className={`w-4 h-4 transition-transform ${isDateDropdownOpen ? "rotate-180" : ""}`} />
									</button>
									{isDateDropdownOpen && (
										<div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 min-w-[180px]">
											{DATE_FILTERS.map((option) => (
												<button
													key={option.value}
													onClick={() => {
														setDateFilter(option.value);
														setIsDateDropdownOpen(false);
														setCurrentPage(1);
													}}
													className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition text-left ${
														dateFilter === option.value
															? "bg-[#014834]/5 text-[#014834] font-semibold"
															: "text-gray-700 hover:bg-gray-50"
													}`}
												>
													{dateFilter === option.value && (
														<div className="w-2 h-2 bg-[#014834] rounded-full" />
													)}
													{option.label}
												</button>
											))}
										</div>
									)}
								</div>

								{/* Status/Transaction Dropdown */}
								<div className="relative" ref={statusDropdownRef}>
									<button
										onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
										className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg text-sm font-semibold transition bg-white ${
											statusFilter !== "all"
												? "border-[#014834] text-[#014834] bg-[#014834]/5"
												: "border-gray-300 text-gray-900 hover:bg-gray-50"
										}`}
									>
										{STATUS_FILTERS.find((s) => s.value === statusFilter)?.label}
										<ChevronDown className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
									</button>
									{isStatusDropdownOpen && (
										<div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 min-w-[200px]">
											{STATUS_FILTERS.map((option) => (
												<button
													key={option.value}
													onClick={() => {
														setStatusFilter(option.value);
														setIsStatusDropdownOpen(false);
														setCurrentPage(1);
													}}
													className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition text-left ${
														statusFilter === option.value
															? "bg-[#014834]/5 text-[#014834] font-semibold"
															: "text-gray-700 hover:bg-gray-50"
													}`}
												>
													{statusFilter === option.value && (
														<div className="w-2 h-2 bg-[#014834] rounded-full" />
													)}
													{option.label}
												</button>
											))}
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Expanded Filter Panel */}
						{isFilterPanelOpen && (
							<div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-sm font-bold text-gray-900">Advanced Filters</h3>
									<button
										onClick={() => setIsFilterPanelOpen(false)}
										className="text-gray-400 hover:text-gray-600 transition"
									>
										<X className="w-5 h-5" />
									</button>
								</div>
								<div className="grid grid-cols-4 gap-4">
									<div>
										<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
											Product Type
										</label>
										<select
											value={filterType}
											onChange={(e) => {
												setFilterType(e.target.value);
												setCurrentPage(1);
											}}
											className="w-full px-3 py-2.5 border border-gray-250 rounded-lg text-sm text-gray-900 outline-none focus:border-[#014834] transition bg-white"
										>
											<option value="all">All Types</option>
											<option value="cattle">Cattle</option>
											<option value="livestock">Livestock</option>
											<option value="poultry">Poultry</option>
										</select>
									</div>
									<div>
										<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
											Min Amount (₦)
										</label>
										<input
											type="number"
											value={filterAmountMin}
											onChange={(e) => {
												setFilterAmountMin(e.target.value);
												setCurrentPage(1);
											}}
											placeholder="0"
											className="w-full px-3 py-2.5 border border-gray-250 rounded-lg text-sm text-gray-900 outline-none focus:border-[#014834] transition"
										/>
									</div>
									<div>
										<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
											Max Amount (₦)
										</label>
										<input
											type="number"
											value={filterAmountMax}
											onChange={(e) => {
												setFilterAmountMax(e.target.value);
												setCurrentPage(1);
											}}
											placeholder="No limit"
											className="w-full px-3 py-2.5 border border-gray-250 rounded-lg text-sm text-gray-900 outline-none focus:border-[#014834] transition"
										/>
									</div>
									<div className="flex items-end">
										<button
											onClick={clearAllFilters}
											className="w-full px-4 py-2.5 border-2 border-gray-300 text-gray-900 font-bold rounded-lg text-sm hover:bg-gray-50 transition"
										>
											Reset Filters
										</button>
									</div>
								</div>
							</div>
						)}

						{/* Orders Table */}
						<div className="bg-white rounded-2xl border border-gray-100 overflow-visible">
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-100">
										<th className="p-4 text-left w-12">
											<input
												type="checkbox"
												checked={paginatedOrders.length > 0 && selectedOrders.length === paginatedOrders.length}
												onChange={toggleSelectAll}
												className="w-4 h-4 rounded border-gray-300 accent-[#014834]"
											/>
										</th>
										<th
											className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition"
											onClick={() => handleSort("order_id")}
										>
											<span className="flex items-center gap-1">
												Order ID
												{getSortIcon("order_id")}
											</span>
										</th>
										<th
											className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition"
											onClick={() => handleSort("product_name")}
										>
											<span className="flex items-center gap-1">
												Livestock
												{getSortIcon("product_name")}
											</span>
										</th>
										<th
											className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition"
											onClick={() => handleSort("buyer_name")}
										>
											<span className="flex items-center gap-1">
												Buyer name
												{getSortIcon("buyer_name")}
											</span>
										</th>
										<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
											Quantity
										</th>
										<th
											className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition"
											onClick={() => handleSort("total_amount")}
										>
											<span className="flex items-center gap-1">
												Total amount
												{getSortIcon("total_amount")}
											</span>
										</th>
										<th
											className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition"
											onClick={() => handleSort("status")}
										>
											<span className="flex items-center gap-1">
												Status
												{getSortIcon("status")}
											</span>
										</th>
										<th
											className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition"
											onClick={() => handleSort("date_created")}
										>
											<span className="flex items-center gap-1">
												Date Created
												{getSortIcon("date_created")}
											</span>
										</th>
										<th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
											Action
										</th>
									</tr>
								</thead>
								<tbody>
									{paginatedOrders.length === 0 ? (
										<tr>
											<td colSpan={9} className="p-12 text-center">
												<div className="flex flex-col items-center">
													<Search className="w-12 h-12 text-gray-300 mb-3" />
													<p className="text-gray-500 font-medium">No orders found</p>
													<p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
													{hasActiveFilters && (
														<button
															onClick={clearAllFilters}
															className="mt-3 px-4 py-2 text-sm text-[#014834] font-semibold hover:underline"
														>
															Clear all filters
														</button>
													)}
												</div>
											</td>
										</tr>
									) : (
										paginatedOrders.map((order) => (
											<tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
												<td className="p-4">
													<input
														type="checkbox"
														checked={selectedOrders.includes(order.id)}
														onChange={() => toggleSelectOrder(order.id)}
														className="w-4 h-4 rounded border-gray-300 accent-[#014834]"
													/>
												</td>
												<td className="p-4">
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
															<img
																src={order.livestock_image}
																alt=""
																className="w-full h-full object-cover"
															/>
														</div>
														<span className="text-sm font-medium text-gray-900">{order.order_id}</span>
													</div>
												</td>
												<td className="p-4">
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
															<img
																src={order.livestock_image}
																alt=""
																className="w-full h-full object-cover"
															/>
														</div>
														<div>
															<p className="text-sm font-medium text-gray-900">{order.product_name}</p>
															<p className="text-xs text-gray-500">{order.product_type}</p>
														</div>
													</div>
												</td>
												<td className="p-4">
													<div className="flex items-center gap-2">
														<div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
															<svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gray-400">
																<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor" />
															</svg>
														</div>
														<span className="text-sm font-medium text-gray-900">{order.buyer_name}</span>
													</div>
												</td>
												<td className="p-4 text-sm text-gray-600">{order.quantity}</td>
												<td className="p-4 text-sm font-medium text-gray-900">{formatPrice(order.total_amount)}</td>
												<td className="p-4">
													<span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(order.status)}`}>
														{order.status}
													</span>
												</td>
												<td className="p-4 text-sm text-gray-500">{order.date_created}</td>
												<td className="p-4">
													<div data-order-menu className="relative">
														<button
															onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
															className="p-2 hover:bg-gray-100 rounded-lg transition"
														>
															<MoreVertical className="w-4 h-4 text-gray-500" />
														</button>
														{openMenuId === order.id && (
															<div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 min-w-[180px]">
																<button
																	onClick={() => {
																		setOpenMenuId(null);
																		router.push(`/dashboard/orders/view/${order.id}`);
																	}}
																	className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-900 font-semibold hover:bg-gray-50 transition text-left"
																>
																	<Eye className="w-4 h-4 text-gray-700" />
																	View Details
																</button>
																<button
																	onClick={() => setOpenMenuId(null)}
																	className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-900 font-semibold hover:bg-gray-50 transition text-left"
																>
																	<Pencil className="w-4 h-4 text-gray-700" />
																	Update Details
																</button>
																<button
																	onClick={() => setOpenMenuId(null)}
																	className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 font-semibold hover:bg-gray-50 transition text-left"
																>
																	<Trash2 className="w-4 h-4" />
																	Archive
																</button>
															</div>
														)}
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>

							{/* Pagination */}
							<div className="flex items-center justify-between py-6 border-t border-gray-100 px-6">
								<p className="text-sm text-gray-500">
									Showing {filteredOrders.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
									{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of{" "}
									{filteredOrders.length} orders
								</p>
								<div className="flex items-center gap-2">
									<button
										onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
										disabled={currentPage === 1}
										className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
									>
										<ChevronLeft className="w-4 h-4 text-gray-500" />
									</button>
									{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
										<button
											key={page}
											onClick={() => setCurrentPage(page)}
											className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${
												currentPage === page
													? "bg-[#014834] text-white"
													: "text-gray-600 hover:bg-gray-50"
											}`}
										>
											{page}
										</button>
									))}
									<button
										onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
										disabled={currentPage === totalPages}
										className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
									>
										<ChevronRight className="w-4 h-4 text-gray-500" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Policy Modals */}
				<CancelOrderModal
					isOpen={Boolean(cancelModalOrder)}
					order={cancelModalOrder}
					buyerId={String(user?.id || "")}
					onClose={() => setCancelModalOrder(null)}
					onSuccess={() => {
						fetchLiveOrders();
					}}
				/>

				<ReportFailureModal
					isOpen={Boolean(failureModalOrder)}
					order={failureModalOrder}
					userRole="seller"
					userId={String(user?.id || "")}
					onClose={() => setFailureModalOrder(null)}
					onSuccess={() => {
						fetchLiveOrders();
					}}
				/>
			</DashboardLayout>
		</AuthGuard>
	);
};

export default OrdersPage;
