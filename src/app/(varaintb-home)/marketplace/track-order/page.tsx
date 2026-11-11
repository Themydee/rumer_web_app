"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import MarketplaceFooterSections from "../_components/MarketplaceFooterSections";

export default function TrackOrderPage() {
	const router = useRouter();
	const [orderId, setOrderId] = useState("");
	const [billingEmail, setBillingEmail] = useState("");

	const handleTrack = (e: React.FormEvent) => {
		e.preventDefault();
		if (orderId.trim()) {
			router.push(`/marketplace/track-order/${orderId.trim()}`);
		}
	};

	return (
		<div className='bg-white min-h-screen'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
				{/* Breadcrumb */}
				<nav className='flex items-center gap-2 text-sm text-gray-500 mb-6'>
					<Link href='/' className='hover:text-[#014834] transition-colors'>Home</Link>
					<ChevronRight className='w-4 h-4' />
					<span className='text-gray-900 font-medium'>Track Order</span>
				</nav>

				<div className='max-w-2xl'>
					<h1 className='text-2xl font-bold text-gray-900 mb-3'>Track Order</h1>
					<p className='text-gray-600 text-sm mb-8 leading-relaxed'>
						To track your order please enter your order ID in the input field below and press the &quot;Track Order&quot; button. This was given to you on your receipt and in the confirmation email you should have received.
					</p>

					<form onSubmit={handleTrack} className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>Order ID</label>
								<input
									type='text'
									value={orderId}
									onChange={(e) => setOrderId(e.target.value)}
									placeholder='ID...'
									className='w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent'
									required
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>Billing Email</label>
								<input
									type='email'
									value={billingEmail}
									onChange={(e) => setBillingEmail(e.target.value)}
									placeholder='Email address'
									className='w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent'
								/>
							</div>
						</div>

						<p className='text-xs text-gray-500'>
							Order ID that we sent to your in your email address.
						</p>

						<button
							type='submit'
							className='flex items-center gap-2 px-6 py-3 bg-[#014834] text-white text-sm font-medium rounded-lg hover:bg-[#013628] transition-colors'
						>
							TRACK ORDER →
						</button>
					</form>
				</div>

				<MarketplaceFooterSections />
			</div>
		</div>
	);
}
