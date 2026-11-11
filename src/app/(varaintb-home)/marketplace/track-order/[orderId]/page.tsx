"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Package, Truck, CheckCircle, Clock } from "lucide-react";
import MarketplaceFooterSections from "../../_components/MarketplaceFooterSections";

const mockOrder = {
	id: "#96459761",
	products: 4,
	date: "17 Jan, 2021 at 7:32 PM",
	total: 700000,
	expectedArrival: "23 Jan, 2021",
	currentStep: 2,
};

const steps = [
	{ label: "Order Placed", icon: CheckCircle },
	{ label: "Packaging", icon: Package },
	{ label: "On The Road", icon: Truck },
	{ label: "Delivered", icon: CheckCircle },
];

const orderActivity = [
	{
		title: "Your order has been delivered. Thank you for shopping at Rumer",
		date: "23 Jan, 2021 at 7:32 PM",
		icon: CheckCircle,
		completed: true,
	},
	{
		title: "Our delivery man (John Wick) has picked up your order for delivery",
		date: "23 Jan, 2021 at 2:00 PM",
		icon: Truck,
		completed: true,
	},
	{
		title: "Your order has reached at last mile hub",
		date: "22 Jan, 2021 at 8:00 AM",
		icon: Package,
		completed: true,
	},
	{
		title: "Your order on the way to East Milton hub",
		date: "21 Jan, 2021 at 4:30 PM",
		icon: Truck,
		completed: true,
	},
	{
		title: "Your order is successfully verified",
		date: "20 Jan, 2021 at 7:32 PM",
		icon: CheckCircle,
		completed: true,
	},
	{
		title: "Your order has been confirmed",
		date: "19 Jan, 2021 at 2:01 PM",
		icon: Clock,
		completed: true,
	},
];

function formatNaira(amount: number): string {
	return `₦${amount.toLocaleString("en-NG")}`;
}

export default function TrackOrderDetailsPage() {
	return (
		<div className='bg-white min-h-screen'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
				{/* Breadcrumb */}
				<nav className='flex items-center gap-2 text-sm text-gray-500 mb-6'>
					<Link href='/' className='hover:text-[#014834] transition-colors'>Home</Link>
					<ChevronRight className='w-4 h-4' />
					<Link href='/marketplace/track-order' className='hover:text-[#014834] transition-colors'>Track Order</Link>
					<ChevronRight className='w-4 h-4' />
					<span className='text-gray-900 font-medium'>Order Details</span>
				</nav>

				{/* Order Header Card */}
				<div className='bg-white border border-gray-200 rounded-xl p-6 mb-8'>
					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
						<div>
							<h1 className='text-xl font-bold text-gray-900'>{mockOrder.id}</h1>
							<p className='text-sm text-gray-500 mt-1'>
								{mockOrder.products} Products • Order Placed on {mockOrder.date}
							</p>
						</div>
						<span className='text-2xl font-bold text-gray-900'>
							{formatNaira(mockOrder.total)}
						</span>
					</div>

					<p className='text-sm text-gray-600 mb-6'>
						Order expected arrival <span className='font-semibold text-gray-900'>{mockOrder.expectedArrival}</span>
					</p>

					{/* Progress Bar */}
					<div className='relative'>
						<div className='flex items-center justify-between relative'>
							{/* Background line */}
							<div className='absolute top-5 left-0 right-0 h-0.5 bg-gray-200' />
							{/* Progress line */}
							<div
								className='absolute top-5 left-0 h-0.5 bg-[#014834] transition-all duration-500'
								style={{ width: `${(mockOrder.currentStep / (steps.length - 1)) * 100}%` }}
							/>

							{steps.map((step, index) => (
								<div key={index} className='flex flex-col items-center relative z-10'>
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center ${
											index <= mockOrder.currentStep
												? "bg-[#014834] text-white"
												: "bg-gray-200 text-gray-500"
										}`}
									>
										<step.icon className='w-5 h-5' />
									</div>
									<span className={`text-xs mt-2 font-medium ${
										index <= mockOrder.currentStep ? "text-[#014834]" : "text-gray-500"
									}`}>
										{step.label}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Order Activity */}
				<div className='bg-white border border-gray-200 rounded-xl p-6'>
					<h2 className='text-lg font-bold text-gray-900 mb-6'>Order Activity</h2>

					<div className='space-y-0'>
						{orderActivity.map((activity, index) => (
							<div key={index} className='flex gap-4 relative'>
								{/* Timeline line */}
								<div className='flex flex-col items-center'>
									<div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
										index === 0 ? "bg-[#014834] text-white" : "bg-gray-100 text-gray-500"
									}`}>
										<activity.icon className='w-4 h-4' />
									</div>
									{index < orderActivity.length - 1 && (
										<div className='w-0.5 h-12 bg-gray-200' />
									)}
								</div>

								{/* Content */}
								<div className='pb-8'>
									<p className={`text-sm font-medium ${
										index === 0 ? "text-gray-900" : "text-gray-700"
									}`}>
										{activity.title}
									</p>
									<p className='text-xs text-gray-500 mt-1'>{activity.date}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<MarketplaceFooterSections />
			</div>
		</div>
	);
}
