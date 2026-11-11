"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ChevronRight, CheckCircle } from "lucide-react";
import { clearCart } from "@/components/lib/marketplace/cart";
import { addNotification } from "@/components/lib/notifications";
import MarketplaceFooterSections from "../_components/MarketplaceFooterSections";

export default function CheckoutSuccessPage() {
	useEffect(() => {
		clearCart();
		if (typeof window !== "undefined" && !sessionStorage.getItem("rumer_checkout_notified")) {
			addNotification({
				title: "Order placed successfully",
				message: "Your order has been placed. You can track it from your dashboard.",
				type: "success",
				link: "/marketplace/account",
			});
			sessionStorage.setItem("rumer_checkout_notified", "true");
		}
	}, []);

	return (
		<div className='bg-white min-h-screen'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
				{/* Breadcrumb */}
				<nav className='flex items-center gap-2 text-sm text-gray-500 mb-6'>
					<Link href='/' className='hover:text-[#014834] transition-colors'>
						Home
					</Link>
					<ChevronRight className='w-4 h-4' />
					<Link href='/marketplace/cart' className='hover:text-[#014834] transition-colors'>
						Shopping Cart
					</Link>
					<ChevronRight className='w-4 h-4' />
					<span className='text-gray-900 font-medium'>Checkout</span>
				</nav>

				{/* Success Content */}
				<div className='flex flex-col items-center justify-center py-16 px-4'>
					<div className='w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6'>
						<CheckCircle className='w-12 h-12 text-green-500' />
					</div>

					<h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center'>
						Your order is successfully placed
					</h1>

					<p className='text-gray-600 text-center max-w-md mb-8'>
						Thank you for your purchase! A confirmation email has been sent to your registered email address. You can track your order status in your dashboard.
					</p>

					<div className='flex flex-col sm:flex-row gap-4'>
						<Link
							href='/marketplace/account'
							className='px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center'
						>
							GO TO DASHBOARD
						</Link>
						<Link
							href='/marketplace/shop'
							className='px-8 py-3 bg-[#014834] text-white font-medium rounded-lg hover:bg-[#013628] transition-colors text-center'
						>
							VIEW ORDER →
						</Link>
					</div>
				</div>

				<MarketplaceFooterSections />
			</div>
		</div>
	);
}
