"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, DollarSign, CreditCard, Wallet, ArrowRight } from "lucide-react";
import {
	getCart,
	getCartTotal,
	formatNaira,
	type CartItem,
} from "@/components/lib/marketplace/cart";
import MarketplaceFooterSections from "../_components/MarketplaceFooterSections";

const nigerianStates = [
	"Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
	"Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
	"Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
	"Kwara", "Lagos", "Nassarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
	"Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT",
];

type PaymentMethod = "cash" | "card" | "gateway" | "paypal" | "amazon";

export default function CheckoutPage() {
	const router = useRouter();
	const [cart, setCart] = useState<CartItem[]>([]);
	const [mounted, setMounted] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
	const [shipDifferent, setShipDifferent] = useState(false);

	const [billing, setBilling] = useState({
		firstName: "",
		lastName: "",
		company: "",
		country: "Nigeria",
		state: "",
		city: "",
		zipCode: "",
		address: "",
		email: "",
		phone: "",
	});

	const [card, setCard] = useState({
		nameOnCard: "",
		cardNumber: "",
		expiryDate: "",
		cvv: "",
	});

	const [notes, setNotes] = useState("");

	useEffect(() => {
		setMounted(true);
		setCart(getCart());
	}, []);

	const subtotal = getCartTotal();
	const shipping = 0;
	const discount = 24;
	const tax = 61.99;
	const total = subtotal + shipping - discount + tax;

	const handlePlaceOrder = () => {
		router.push("/marketplace/checkout-success");
	};

	if (!mounted) return null;

	const paymentMethods = [
		{ id: "cash" as PaymentMethod, label: "Cash on Delivery", icon: DollarSign },
		{ id: "card" as PaymentMethod, label: "Debit/Credit Card", icon: CreditCard },
		{ id: "gateway" as PaymentMethod, label: "Payment Gateway", icon: Wallet },
		{ id: "paypal" as PaymentMethod, label: "Paypal", icon: null, text: "P" },
		{ id: "amazon" as PaymentMethod, label: "Amazon Pay", icon: null, text: "a" },
	];

	return (
		<div className='bg-white min-h-screen'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
				{/* Breadcrumb */}
				<nav className='flex items-center gap-2 text-sm text-gray-500 mb-8'>
					<Link href='/' className='hover:text-[#014834] transition-colors'>
						Home
					</Link>
					<ChevronRight className='w-4 h-4' />
					<Link href='/marketplace/cart' className='hover:text-[#014834] transition-colors'>
						Shopping Cart
					</Link>
					<ChevronRight className='w-4 h-4' />
					<span className='text-[#014834] font-medium'>Checkout</span>
				</nav>

				<div className='flex flex-col lg:flex-row gap-8'>
					{/* Left - Forms */}
					<div className='flex-1 space-y-8'>
						{/* Billing Information */}
						<div>
							<h2 className='text-lg font-bold text-gray-900 mb-6'>Billing Information</h2>

							<div className='space-y-4'>
								{/* First / Last / Company */}
								<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
									<div>
										<label className='block text-xs text-gray-600 mb-1.5'>First name</label>
										<input
											type='text'
											value={billing.firstName}
											onChange={(e) => setBilling({ ...billing, firstName: e.target.value })}
											className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent'
										/>
									</div>
									<div>
										<label className='block text-xs text-gray-600 mb-1.5'>Last name</label>
										<input
											type='text'
											value={billing.lastName}
											onChange={(e) => setBilling({ ...billing, lastName: e.target.value })}
											className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent'
										/>
									</div>
									<div>
										<label className='block text-xs text-gray-600 mb-1.5'>
											Company Name <span className='text-gray-400'>(Optional)</span>
										</label>
										<input
											type='text'
											value={billing.company}
											onChange={(e) => setBilling({ ...billing, company: e.target.value })}
											className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent'
										/>
									</div>
								</div>

								{/* Address */}
								<div>
									<label className='block text-xs text-gray-600 mb-1.5'>Address</label>
									<input
										type='text'
										value={billing.address}
										onChange={(e) => setBilling({ ...billing, address: e.target.value })}
										className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent'
									/>
								</div>

								{/* Country / State / City / Zip */}
								<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
									<div>
										<label className='block text-xs text-gray-600 mb-1.5'>Country</label>
										<select
											value={billing.country}
											onChange={(e) => setBilling({ ...billing, country: e.target.value })}
											className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-white text-gray-600'
										>
											<option value='Nigeria'>Select...</option>
											<option value='Nigeria'>Nigeria</option>
										</select>
									</div>
									<div>
										<label className='block text-xs text-gray-600 mb-1.5'>Region/State</label>
										<select
											value={billing.state}
											onChange={(e) => setBilling({ ...billing, state: e.target.value })}
											className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-white text-gray-600'
										>
											<option value=''>Select...</option>
											{nigerianStates.map((s) => (
												<option key={s} value={s}>{s}</option>
											))}
										</select>
									</div>
									<div>
										<label className='block text-xs text-gray-600 mb-1.5'>City</label>
										<select
											value={billing.city}
											onChange={(e) => setBilling({ ...billing, city: e.target.value })}
											className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-white text-gray-600'
										>
											<option value=''>Select...</option>
											<option value='Lagos'>Lagos</option>
											<option value='Abuja'>Abuja</option>
										</select>
									</div>
									<div>
										<label className='block text-xs text-gray-600 mb-1.5'>Zip Code</label>
										<input
											type='text'
											value={billing.zipCode}
											onChange={(e) => setBilling({ ...billing, zipCode: e.target.value })}
											className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent'
										/>
									</div>
								</div>

								{/* Email / Phone */}
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<label className='block text-xs text-gray-600 mb-1.5'>Email</label>
										<input
											type='email'
											value={billing.email}
											onChange={(e) => setBilling({ ...billing, email: e.target.value })}
											className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent'
										/>
									</div>
									<div>
										<label className='block text-xs text-gray-600 mb-1.5'>Phone Number</label>
										<input
											type='tel'
											value={billing.phone}
											onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
											className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent'
										/>
									</div>
								</div>
							</div>

							<label className='flex items-center gap-2 mt-4 cursor-pointer'>
								<input
									type='checkbox'
									checked={shipDifferent}
									onChange={(e) => setShipDifferent(e.target.checked)}
									className='w-4 h-4 rounded border-gray-300 text-[#014834] focus:ring-[#014834]'
								/>
								<span className='text-sm text-gray-600'>Ship into different address</span>
							</label>
						</div>

						{/* Payment Option */}
						<div>
							<h2 className='text-lg font-bold text-gray-900 mb-4'>Payment Option</h2>

							<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
								{paymentMethods.map((method) => (
									<label
										key={method.id}
										className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors ${
											paymentMethod === method.id
												? "border-[#014834] bg-green-50/50"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										{method.icon ? (
											<method.icon className='w-6 h-6 text-[#014834]' />
										) : (
											<span className={`text-xl font-bold ${method.id === "paypal" ? "text-blue-700" : "text-orange-500"}`}>
												{method.text}
											</span>
										)}
										<span className='text-xs text-center text-gray-700 leading-tight'>{method.label}</span>
										<input
											type='radio'
											name='payment'
											checked={paymentMethod === method.id}
											onChange={() => setPaymentMethod(method.id)}
											className='w-4 h-4 text-[#014834] focus:ring-[#014834] mt-1'
										/>
									</label>
								))}
							</div>

							{/* Card Details */}
							{paymentMethod === "card" && (
								<div className='mt-6 p-5 border border-gray-200 rounded-lg space-y-4'>
									<div>
										<label className='block text-xs text-gray-600 mb-1.5'>Name on Card</label>
										<input
											type='text'
											value={card.nameOnCard}
											onChange={(e) => setCard({ ...card, nameOnCard: e.target.value })}
											className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent'
										/>
									</div>
									<div>
										<label className='block text-xs text-gray-600 mb-1.5'>Card Number</label>
										<input
											type='text'
											value={card.cardNumber}
											onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}
											className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent'
										/>
									</div>
									<div className='grid grid-cols-2 gap-4'>
										<div>
											<label className='block text-xs text-gray-600 mb-1.5'>Expire Date</label>
											<input
												type='text'
												value={card.expiryDate}
												onChange={(e) => setCard({ ...card, expiryDate: e.target.value })}
												placeholder='DD/YY'
												className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent'
											/>
										</div>
										<div>
											<label className='block text-xs text-gray-600 mb-1.5'>CVC</label>
											<input
												type='text'
												value={card.cvv}
												onChange={(e) => setCard({ ...card, cvv: e.target.value })}
												className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent'
											/>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Additional Information */}
						<div>
							<h2 className='text-lg font-bold text-gray-900 mb-4'>Additional Information</h2>
							<label className='block text-xs text-gray-600 mb-1.5'>
								Order Notes <span className='text-gray-400'>(Optional)</span>
							</label>
							<textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								rows={4}
								placeholder='Notes about your order, e.g. special notes for delivery.'
								className='w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent resize-none'
							/>
						</div>
					</div>

					{/* Right - Order Summary */}
					<div className='lg:w-[360px] flex-shrink-0'>
						<div className='bg-white border border-gray-200 rounded-xl p-6 sticky top-24'>
							<h2 className='text-lg font-bold text-gray-900 mb-6'>Order Summary</h2>

							{cart.length === 0 ? (
								<p className='text-sm text-gray-500 text-center py-4'>Your cart is empty.</p>
							) : (
								<>
									<div className='space-y-4 mb-6'>
										{cart.map((item) => (
											<div key={item.id} className='flex items-center gap-3'>
												<img
													src={item.image || "https://placehold.co/60?text=No+Image"}
													alt={item.name}
													className='w-14 h-14 object-cover rounded-lg border border-gray-200'
												/>
												<div className='flex-1 min-w-0'>
													<h3 className='text-sm font-medium text-gray-900 truncate'>{item.name}</h3>
													<p className='text-xs text-gray-500'>
														{item.quantity} x {formatNaira(item.price)}.00
													</p>
												</div>
												<span className='text-sm font-medium text-gray-900 whitespace-nowrap'>
													{formatNaira(item.price * item.quantity)}.00
												</span>
											</div>
										))}
									</div>

									<div className='border-t border-gray-200 pt-4 space-y-3'>
										<div className='flex items-center justify-between text-sm'>
											<span className='text-gray-600'>Sub-total</span>
											<span className='font-medium text-gray-900'>{formatNaira(subtotal)}</span>
										</div>
										<div className='flex items-center justify-between text-sm'>
											<span className='text-gray-600'>Shipping</span>
											<span className='font-medium text-[#014834]'>Free</span>
										</div>
										<div className='flex items-center justify-between text-sm'>
											<span className='text-gray-600'>Discount</span>
											<span className='font-medium text-gray-900'>{formatNaira(discount)}</span>
										</div>
										<div className='flex items-center justify-between text-sm'>
											<span className='text-gray-600'>Tax</span>
											<span className='font-medium text-gray-900'>₦{tax.toFixed(2)}</span>
										</div>
										<div className='border-t border-gray-200 pt-3'>
											<div className='flex items-center justify-between'>
												<span className='text-base font-bold text-gray-900'>Total</span>
												<span className='text-base font-bold text-gray-900'>{formatNaira(total)} NGN</span>
											</div>
										</div>
									</div>

									<button
										onClick={handlePlaceOrder}
										className='w-full mt-6 py-3 bg-[#014834] text-white text-center text-sm font-medium rounded-lg hover:bg-[#013628] transition-colors flex items-center justify-center gap-2'
									>
										PLACE ORDER
										<ArrowRight className='w-4 h-4' />
									</button>
								</>
							)}
						</div>
					</div>
				</div>

				<MarketplaceFooterSections />
			</div>
		</div>
	);
}
