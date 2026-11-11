"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { ArrowLeft, Download } from "lucide-react";

const MOCK_SALE = {
	id: "106980",
	name: "Goat",
	species: "Goat",
	breed: "Boer Goat",
	quantity_sold: 10,
	weight: "10kg",
	hs_code: "0102 – Live bovine animals",
	location: "Kwara State, Ilorin West LGA",
	price_per_unit: 350000,
	total_sale_value: 3500000,
	tags: "483",
	last_edited: "12.11.25 13:10 pm",
	image: "/home/goat.png",
};

const MOCK_BUYER = {
	name: "ABC Farms Limited",
	type: "Verified Buyer",
	contact_method: "In-app chat",
	id: "BY-003491",
	last_edited: "12.11.25 13:10 pm",
};

const SoldLivestockViewPage = () => {
	const router = useRouter();
	const params = useParams();
	const productId = params.productId as string;

	const formatPrice = (price: number) => {
		return `₦${price.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	};

	return (
		<AuthGuard>
			<DashboardLayout>
				<div className="min-h-screen bg-gray-50">
					<div className="max-w-[1200px] mx-auto px-6 py-8">
						{/* Breadcrumb */}
						<div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
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
								onClick={() => router.push("/dashboard/products/sold")}
								className="hover:text-gray-700 transition"
							>
								Livestock Summary
							</button>
							<span>/</span>
							<span className="text-gray-500">Livestock ID: {MOCK_SALE.id}</span>
							<span>/</span>
							<span className="text-gray-900 font-medium">View</span>
						</div>

						{/* Title */}
						<div className="mb-6">
							<h1 className="text-3xl font-bold text-gray-900">Sale Summary</h1>
							<p className="text-gray-500 mt-1">This livestock has been sold successfully</p>
						</div>

						{/* Escrow Notice */}
						<div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
							<p className="text-center text-sm font-semibold text-green-700">
								This sale was completed after payment was confirmed through escrow.
							</p>
						</div>

						{/* Livestock Details Card */}
						<div className="bg-white rounded-2xl border border-gray-200 mb-8">
							{/* Header */}
							<div className="flex items-center justify-between p-6 border-b border-gray-100">
								<div className="flex items-center gap-4">
									<div className="w-14 h-14 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
										<img
											src={MOCK_SALE.image}
											alt={MOCK_SALE.name}
											className="w-full h-full object-cover"
										/>
									</div>
									<div>
										<h2 className="text-xl font-bold text-gray-900">{MOCK_SALE.name}</h2>
										<div className="flex items-center gap-2 mt-1">
											<span className="text-sm text-gray-500">Livestock ID: {MOCK_SALE.id}</span>
											<span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200">
												Sold
											</span>
										</div>
									</div>
								</div>
								<button className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 text-gray-900 font-bold rounded-lg text-sm hover:bg-gray-50 transition">
									<Download className="w-4 h-4" />
									Download Receipt
								</button>
							</div>

							{/* Details Grid */}
							<div className="p-6">
								<div className="grid grid-cols-4 gap-y-6 gap-x-4">
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Livestock Type(Species)</p>
										<p className="text-sm font-bold text-gray-900">{MOCK_SALE.species}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Breed</p>
										<p className="text-sm font-bold text-gray-900">{MOCK_SALE.breed}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Quantity Sold</p>
										<p className="text-sm font-bold text-gray-900">{MOCK_SALE.quantity_sold}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Weight (kg)</p>
										<p className="text-sm font-bold text-gray-900">{MOCK_SALE.weight}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">HS Code</p>
										<p className="text-sm font-bold text-gray-900">{MOCK_SALE.hs_code}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Location</p>
										<p className="text-sm font-bold text-gray-900">{MOCK_SALE.location}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Price per Unit</p>
										<p className="text-sm font-bold text-[#014834]">{formatPrice(MOCK_SALE.price_per_unit)}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Sale Value</p>
										<p className="text-sm font-bold text-[#014834]">{formatPrice(MOCK_SALE.total_sale_value)}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tags</p>
										<p className="text-sm font-bold text-gray-900">{MOCK_SALE.tags}</p>
									</div>
									<div className="col-span-3">
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Last edited on</p>
										<p className="text-sm font-bold text-gray-900">{MOCK_SALE.last_edited}</p>
									</div>
								</div>
							</div>
						</div>

						{/* Buyer Details */}
						<div className="bg-white rounded-2xl border border-gray-200 mb-8">
							<div className="p-6 border-b border-gray-100">
								<h2 className="text-xl font-bold text-gray-900">Buyer Details</h2>
							</div>
							<div className="p-6">
								<div className="grid grid-cols-5 gap-y-6 gap-x-4 mb-6">
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Buyer Name</p>
										<p className="text-sm font-bold text-gray-900">{MOCK_BUYER.name}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Buyer Type</p>
										<p className="text-sm font-bold text-gray-900">{MOCK_BUYER.type}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Contact Method</p>
										<p className="text-sm font-bold text-gray-900">{MOCK_BUYER.contact_method}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Buyer ID</p>
										<p className="text-sm font-bold text-gray-900">{MOCK_BUYER.id}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Last edited on</p>
										<p className="text-sm font-bold text-gray-900">{MOCK_BUYER.last_edited}</p>
									</div>
								</div>
								<div className="pt-4 border-t border-gray-100">
									<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Text</p>
									<p className="text-sm text-gray-600">Buyer details are shown for reference and transaction records.</p>
								</div>
							</div>
						</div>

						{/* Payment Information */}
						<div className="bg-white rounded-2xl border border-gray-200">
							<div className="p-6 border-b border-gray-100">
								<h2 className="text-xl font-bold text-gray-900">Payment Information</h2>
							</div>
							<div className="p-6">
								<div className="grid grid-cols-3 gap-y-6 gap-x-4">
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Payment Status</p>
										<p className="text-sm font-bold text-green-700">Paid in Full</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Payment Method</p>
										<p className="text-sm font-bold text-gray-900">Escrow Transfer</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Escrow Release</p>
										<p className="text-sm font-bold text-gray-900">Completed</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Transaction ID</p>
										<p className="text-sm font-bold text-gray-900">TXN-{MOCK_SALE.id}-001</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Date Completed</p>
										<p className="text-sm font-bold text-gray-900">{MOCK_SALE.last_edited}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Platform Fee</p>
										<p className="text-sm font-bold text-gray-900">{formatPrice(MOCK_SALE.total_sale_value * 0.025)}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DashboardLayout>
		</AuthGuard>
	);
};

export default SoldLivestockViewPage;
