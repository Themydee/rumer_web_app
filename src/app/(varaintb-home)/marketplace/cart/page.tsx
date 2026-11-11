"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, X, ShoppingCart } from "lucide-react";
import {
	getCart,
	removeFromCart,
	updateQuantity,
	getCartTotal,
	formatNaira,
	type CartItem,
} from "@/components/lib/marketplace/cart";
import MarketplaceFooterSections from "../_components/MarketplaceFooterSections";

export default function CartPage() {
	const [cart, setCart] = useState<CartItem[]>([]);
	const [mounted, setMounted] = useState(false);
	const [couponCode, setCouponCode] = useState("");

	useEffect(() => {
		setMounted(true);
		setCart(getCart());
	}, []);

	const handleRemove = (id: string) => {
		setCart(removeFromCart(id));
	};

	const handleQuantity = (id: string, quantity: number) => {
		setCart(updateQuantity(id, quantity));
	};

	const subtotal = getCartTotal();
	const discount = 0;
	const tax = 0;
	const total = subtotal - discount + tax;

	if (!mounted) return null;

	return (
		<div className='bg-white min-h-screen'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
				{/* Breadcrumb */}
				<nav className='flex items-center gap-2 text-sm text-gray-500 mb-6'>
					<Link href='/' className='hover:text-[#014834] transition-colors'>
						Home
					</Link>
					<ChevronRight className='w-4 h-4' />
					<span className='text-[#014834] font-medium'>Shopping Cart</span>
				</nav>

				<h1 className='text-2xl font-bold text-gray-900 mb-6'>Shopping Cart</h1>

				{cart.length === 0 ? (
					<div className='bg-white rounded-xl p-12 text-center border border-gray-200'>
						<ShoppingCart className='w-16 h-16 text-gray-300 mx-auto mb-4' />
						<p className='text-gray-600 mb-6 text-lg'>Your cart is empty.</p>
						<Link
							href='/marketplace/shop'
							className='inline-flex items-center px-6 py-3 bg-[#014834] text-white rounded-lg hover:bg-[#013628] transition-colors font-medium'
						>
							Return To Shop
						</Link>
					</div>
				) : (
					<div className='flex flex-col lg:flex-row gap-8'>
						{/* Left - Cart Items */}
						<div className='flex-1'>
							{/* Cart Table */}
							<div className='border border-gray-200 rounded-xl overflow-hidden'>
								{/* Table Header */}
								<div className='grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
									<div className='col-span-5'>Products</div>
									<div className='col-span-2 text-center'>Price</div>
									<div className='col-span-3 text-center'>Quantity</div>
									<div className='col-span-2 text-right'>Sub-total</div>
								</div>

								{/* Table Rows */}
								{cart.map((item) => (
									<div
										key={item.id}
										className='grid grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 items-center last:border-b-0'
									>
										{/* Product */}
										<div className='col-span-5 flex items-center gap-4'>
											<button
												onClick={() => handleRemove(item.id)}
												className='w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors flex-shrink-0'
												aria-label='Remove item'
											>
												<X className='w-3 h-3' />
											</button>
											<img
												src={item.image || "https://placehold.co/80?text=No+Image"}
												alt={item.name}
												className='w-16 h-16 object-cover rounded-lg border border-gray-200'
											/>
											<div>
												<h3 className='font-medium text-gray-900 text-sm'>{item.name}</h3>
												<p className='text-xs text-gray-500 mt-0.5'>Color: Default</p>
											</div>
										</div>

										{/* Price */}
										<div className='col-span-2 text-center text-sm text-gray-900'>
											{formatNaira(item.price)}
										</div>

										{/* Quantity */}
										<div className='col-span-3 flex items-center justify-center'>
											<div className='flex items-center border border-gray-300 rounded-md'>
												<button
													onClick={() => handleQuantity(item.id, item.quantity - 1)}
													className='w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors'
												>
													-
												</button>
												<span className='w-10 h-9 flex items-center justify-center text-sm font-medium border-x border-gray-300'>
													{String(item.quantity).padStart(2, "0")}
												</span>
												<button
													onClick={() => handleQuantity(item.id, item.quantity + 1)}
													className='w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors'
												>
													+
												</button>
											</div>
										</div>

										{/* Subtotal */}
										<div className='col-span-2 text-right text-sm font-medium text-gray-900'>
											{formatNaira(item.price * item.quantity)}
										</div>
									</div>
								))}
							</div>

							{/* Action Buttons */}
							<div className='flex items-center justify-between mt-6'>
								<Link
									href='/marketplace/shop'
									className='inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors'
								>
									<ChevronLeft className='w-4 h-4' />
									RETURN TO SHOP
								</Link>
								<button
									onClick={() => setCart(getCart())}
									className='px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors'
								>
									UPDATE CART
								</button>
							</div>
						</div>

						{/* Right - Cart Totals */}
						<div className='lg:w-80 flex-shrink-0 space-y-6'>
							{/* Cart Totals Card */}
							<div className='bg-white border border-gray-200 rounded-xl p-6'>
								<h2 className='text-lg font-bold text-gray-900 mb-5'>Cart Totals</h2>

								<div className='space-y-3'>
									<div className='flex items-center justify-between py-2'>
										<span className='text-sm text-gray-600'>Sub-total</span>
										<span className='text-sm font-medium text-gray-900'>{formatNaira(subtotal)}</span>
									</div>
									<div className='flex items-center justify-between py-2 border-t border-gray-100'>
										<span className='text-sm text-gray-600'>Shipping</span>
										<span className='text-sm font-medium text-[#014834]'>Free</span>
									</div>
									<div className='flex items-center justify-between py-2 border-t border-gray-100'>
										<span className='text-sm text-gray-600'>Discount</span>
										<span className='text-sm font-medium text-gray-900'>{formatNaira(discount)}</span>
									</div>
									<div className='flex items-center justify-between py-2 border-t border-gray-100'>
										<span className='text-sm text-gray-600'>Tax</span>
										<span className='text-sm font-medium text-gray-900'>{formatNaira(tax)}</span>
									</div>
									<div className='flex items-center justify-between py-3 border-t border-gray-200'>
										<span className='text-base font-bold text-gray-900'>Total</span>
										<span className='text-base font-bold text-gray-900'>{formatNaira(total)} NGN</span>
									</div>
								</div>

								<Link
									href='/marketplace/checkout'
									className='block w-full mt-5 py-3 bg-[#014834] text-white text-center text-sm font-medium rounded-lg hover:bg-[#013628] transition-colors'
								>
									PROCEED TO CHECKOUT →
								</Link>
							</div>

							{/* Coupon Code Card */}
							<div className='bg-white border border-gray-200 rounded-xl p-6'>
								<h3 className='text-sm font-bold text-gray-900 mb-4'>Coupon Code</h3>
								<input
									type='email'
									value={couponCode}
									onChange={(e) => setCouponCode(e.target.value)}
									placeholder='Email address'
									className='w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent mb-3'
								/>
								<button className='px-6 py-2.5 bg-[#0e7c61] text-white text-sm font-medium rounded-lg hover:bg-[#0c6a53] transition-colors'>
									APPLY COUPON
								</button>
							</div>
						</div>
					</div>
				)}

				<MarketplaceFooterSections />
			</div>
		</div>
	);
}
