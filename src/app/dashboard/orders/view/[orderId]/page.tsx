"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import {
	ArrowLeft,
	MoreVertical,
	Phone,
	Mail,
	MessageCircle,
	MapPin,
	Download,
	Printer,
	Edit3,
	Truck,
	Receipt,
	CheckCircle2,
	FileText,
} from "lucide-react";

const MOCK_ORDER = {
	id: "LSTK-8842",
	status: "Payment Secured",
	created_date: "Oct 24, 2023",
	order_date: "5 pngs",
	last_updated: "12.11.25 13:10 pm",
	transaction_type: "Live Auction",
	total_amount: 4500000,
	payment_method: "Wire Transfer",
	escrow_status: "Funding Held",
	escrow_release: "Pending Delivery",
	buyer: {
		name: "Green Pastures",
		id: "#BP-9921",
		phone: "(512) 555-0123",
		email: "procurement@greenpastures.com",
		avatar: "",
	},
	delivery: {
		address: "123 Ranch Road",
		city: "Austin, Texas 78701",
	},
	delivery_progress: {
		packed: true,
		in_transit: true,
		delivered: false,
		delivered_step: 3,
	},
	items: [
		{
			id: "ORD-10294",
			product_name: "Cow - White Fulani",
			product_type: "Grade A",
			buyer_name: "Green River Co.",
			quantity: "55kg",
			total_amount: 8000000,
			status: "active",
			date_created: "12.11.25 13:10 pm",
		},
		{
			id: "ORD-10295",
			product_name: "Goat - West Afric...",
			product_type: "Grade B",
			buyer_name: "Farm Fresh Ltd",
			quantity: "30kg",
			total_amount: 3500000,
			status: "pending",
			date_created: "12.11.25 14:00 pm",
		},
	],
};

const ViewOrderPage = () => {
	const router = useRouter();
	const params = useParams();
	const orderId = params.orderId as string;
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (!(e.target as HTMLElement).closest("[data-order-menu]")) {
				setOpenMenuId(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const formatPrice = (price: number) => {
		return `₦${price.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-700 border border-green-200";
			case "pending":
				return "bg-orange-100 text-orange-700 border border-orange-200";
			default:
				return "bg-gray-100 text-gray-600 border border-gray-200";
		}
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
							<button
								onClick={() => router.push("/dashboard/orders")}
								className="hover:text-gray-700 transition"
							>
								All Orders
							</button>
						</div>

						{/* Header */}
						<div className="flex items-start justify-between mb-8">
							<div>
								<div className="flex items-center gap-4 mb-2">
									<h1 className="text-3xl font-bold text-gray-900">Order #{MOCK_ORDER.id}</h1>
									<span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-semibold text-green-700">
										<CheckCircle2 className="w-3.5 h-3.5" />
										{MOCK_ORDER.status}
									</span>
								</div>
								<p className="text-gray-500">Created {MOCK_ORDER.created_date}</p>
							</div>
							<div className="flex items-center gap-3">
								<button className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 text-gray-900 font-bold rounded-lg text-sm hover:bg-gray-50 transition">
									<Phone className="w-4 h-4" />
									Contact Buyer
								</button>
								<button className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 text-gray-900 font-bold rounded-lg text-sm hover:bg-gray-50 transition">
									<Truck className="w-4 h-4" />
									Update Delivery Status
								</button>
								<button className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 text-gray-900 font-bold rounded-lg text-sm hover:bg-gray-50 transition">
									<Printer className="w-4 h-4" />
									Print Order
								</button>
								<button className="flex items-center gap-2 px-4 py-2.5 bg-[#014834] text-white font-semibold rounded-lg text-sm hover:bg-[#013828] transition">
									<Receipt className="w-4 h-4" />
									View Receipt
								</button>
								<div data-order-menu className="relative">
									<button
										onClick={() => setOpenMenuId(openMenuId === "header" ? null : "header")}
										className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition"
									>
										<MoreVertical className="w-4 h-4 text-gray-500" />
									</button>
									{openMenuId === "header" && (
										<div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 min-w-[180px]">
											<button
												onClick={() => setOpenMenuId(null)}
												className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-900 font-semibold hover:bg-gray-50 transition text-left"
											>
												<FileText className="w-4 h-4 text-gray-700" />
												Download Invoice
											</button>
											<button
												onClick={() => setOpenMenuId(null)}
												className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-900 font-semibold hover:bg-gray-50 transition text-left"
											>
												<Edit3 className="w-4 h-4 text-gray-700" />
												Edit Order
											</button>
										</div>
									)}
								</div>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-6 mb-8">
							{/* Left Content */}
							<div className="col-span-2 space-y-6">
								{/* Order Details Cards */}
								<div className="grid grid-cols-3 gap-4">
									<div className="bg-white rounded-xl border border-gray-200 p-5">
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Order Date</p>
										<p className="text-lg font-bold text-gray-900">{MOCK_ORDER.order_date}</p>
									</div>
									<div className="bg-white rounded-xl border border-gray-200 p-5">
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Last Updated</p>
										<p className="text-lg font-bold text-gray-900">{MOCK_ORDER.last_updated}</p>
									</div>
									<div className="bg-white rounded-xl border border-gray-200 p-5">
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Transaction Type</p>
										<p className="text-lg font-bold text-gray-900">{MOCK_ORDER.transaction_type}</p>
									</div>
								</div>

								{/* Buyer & Delivery Section */}
								<div className="bg-white rounded-2xl border border-gray-200 p-6">
									<div className="flex items-center justify-between mb-6">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
												<Truck className="w-5 h-5 text-orange-500" />
											</div>
											<h2 className="text-lg font-bold text-gray-900">Buyer & Delivery</h2>
										</div>
										<button className="flex items-center gap-2 px-4 py-2 border-2 border-[#014834] text-[#014834] font-bold rounded-lg text-sm hover:bg-[#014834]/5 transition">
											<Edit3 className="w-4 h-4" />
											Edit Details
										</button>
									</div>

									<div className="grid grid-cols-2 gap-6">
										{/* Buyer Profile */}
										<div>
											<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Buyer Profile</p>
											<div className="bg-gray-50 rounded-xl p-4">
												<div className="flex items-center gap-4 mb-4">
													<div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
														GP
													</div>
													<div>
														<p className="font-bold text-gray-900">{MOCK_ORDER.buyer.name}</p>
														<p className="text-sm text-gray-500">ID: {MOCK_ORDER.buyer.id}</p>
													</div>
													<div className="ml-auto">
														<button className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition">
															<MessageCircle className="w-5 h-5 text-white" />
														</button>
													</div>
												</div>
												<div className="space-y-3">
													<div className="flex items-center gap-3 text-sm text-gray-600">
														<Phone className="w-4 h-4 text-gray-400" />
														<span>* {MOCK_ORDER.buyer.phone}</span>
													</div>
													<div className="flex items-center gap-3 text-sm text-gray-600">
														<Mail className="w-4 h-4 text-gray-400" />
														<span>{MOCK_ORDER.buyer.email}</span>
													</div>
												</div>
											</div>
										</div>

										{/* Delivery Destination */}
										<div>
											<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Delivery Destination</p>
											<div className="bg-gray-50 rounded-xl p-4">
												<div className="flex items-start gap-3 mb-4">
													<div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
														<MapPin className="w-5 h-5 text-green-600" />
													</div>
													<div>
														<p className="font-bold text-gray-900">{MOCK_ORDER.delivery.address}</p>
														<p className="text-sm text-gray-500">{MOCK_ORDER.delivery.city}</p>
														<button className="text-sm text-green-600 font-medium hover:underline mt-1">
															View on Map
														</button>
													</div>
												</div>

												{/* Delivery Progress */}
												<div className="flex items-center justify-between mt-6">
													<div className="flex items-center gap-2">
														<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
															<CheckCircle2 className="w-5 h-5 text-white" />
														</div>
														<span className="text-sm font-medium text-green-700">Packed</span>
													</div>
													<div className="flex-1 h-0.5 bg-green-500 mx-3" />
													<div className="flex items-center gap-2">
														<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
															<CheckCircle2 className="w-5 h-5 text-white" />
														</div>
														<span className="text-sm font-medium text-green-700">In Transit</span>
													</div>
													<div className="flex-1 h-0.5 bg-gray-200 mx-3" />
													<div className="flex items-center gap-2">
														<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
															<span className="text-sm font-bold text-gray-500">{MOCK_ORDER.delivery_progress.delivered_step}</span>
														</div>
														<span className="text-sm font-medium text-gray-400">Delivered</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>


							</div>

							{/* Right Sidebar - Payment */}
							<div className="col-span-1">
								<div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
									<h2 className="text-lg font-bold text-gray-900 mb-6">Payment</h2>

									<div className="bg-green-50 border-2 border-[#014834] rounded-xl p-6 mb-6">
										<p className="text-sm text-gray-600 text-center mb-2">Total Amount</p>
										<p className="text-2xl font-bold text-[#014834] text-center">
											{formatPrice(MOCK_ORDER.total_amount)}/head
										</p>
										<div className="flex items-center justify-center gap-2 mt-3">
											<CheckCircle2 className="w-4 h-4 text-[#014834]" />
											<span className="text-sm font-bold text-[#014834]">PAID IN FULL</span>
										</div>
									</div>

									<div className="space-y-4 mb-6">
										<div className="flex items-center justify-between">
											<span className="text-sm text-gray-500">Payment Method</span>
											<span className="text-sm font-medium text-gray-900">{MOCK_ORDER.payment_method}</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-gray-500">Escrow Status</span>
											<span className="flex items-center gap-2 text-sm font-medium text-orange-600">
												<span className="w-2 h-2 bg-orange-500 rounded-full" />
												{MOCK_ORDER.escrow_status}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-gray-500">Escrow Release</span>
											<span className="text-sm font-medium text-gray-900">{MOCK_ORDER.escrow_release}</span>
										</div>
									</div>

									<button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-900 font-bold rounded-lg text-sm hover:bg-gray-50 transition">
										<Download className="w-4 h-4" />
										Download Invoice PDF
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DashboardLayout>
		</AuthGuard>
	);
};

export default ViewOrderPage;
