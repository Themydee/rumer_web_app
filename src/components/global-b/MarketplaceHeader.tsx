"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
	Search,
	ShoppingCart,
	Heart,
	User,
	Menu,
	X,
	MapPin,
	ChevronDown,
	Facebook,
	Instagram,
	Youtube,
	Globe,
} from "lucide-react";
import Picture from "@/components/reusables/Picture";
import { rummerLogoGreen } from "../../../public";
import { useAppSelector } from "@/components/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { getCartCount, getCart, getCartTotal, removeFromCart, formatNaira, type CartItem } from "@/components/lib/marketplace/cart";
import { getWishlist } from "@/components/lib/marketplace/wishlist";
import { getCompareList } from "@/components/lib/marketplace/compare";
import { signOut } from "@/components/utils/data";
import NotificationBell from "@/components/reusables/NotificationBell";
import { marketplaceCategories } from "@/components/utils/constants";

const topBarLinks = [
	{ label: "Shop", href: "/marketplace/shop" },
	{ label: "Track Order", href: "/marketplace/track-order" },
	{ label: "Compare", href: "/marketplace/compare" },
	{ label: "Help and Support", href: "/contact-us" },
];

const nigerianStates = [
	"Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
	"Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
	"Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
	"Kwara", "Lagos", "Nassarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
	"Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
];

const categoryOptions = [
	"Live Animals",
	"Processed Meat",
	"Farm Inputs",
	"Wholesales",
	"Retail Packs",
];

export default function MarketplaceHeader() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { user } = useAppSelector((state) => state.auth);

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
	const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
	const [cartCount, setCartCount] = useState(0);
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [wishlistCount, setWishlistCount] = useState(0);
	const [compareCount, setCompareCount] = useState(0);
	const [location, setLocation] = useState(searchParams.get("state") || "Lagos");
	const [language, setLanguage] = useState("Eng");
	const [currency, setCurrency] = useState("Naria");

	const activeSearch = searchParams.get("search") || "";
	const activeLivestockType = searchParams.get("livestockType") || "";
	const activeProductType = searchParams.get("productType") || "";
	const activeState = searchParams.get("state") || "";

	const userName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
	const initials = userName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const isLoggedIn = !!user;

	useEffect(() => {
		setCartCount(getCartCount());
		setCartItems(getCart());
		setWishlistCount(getWishlist().length);
		setCompareCount(getCompareList().length);
	}, []);

	useEffect(() => {
		const handleCartUpdate = () => {
			setCartCount(getCartCount());
			setCartItems(getCart());
		};
		const handleWishlistUpdate = () => setWishlistCount(getWishlist().length);
		const handleCompareUpdate = () => setCompareCount(getCompareList().length);
		const handleStorage = () => {
			setCartCount(getCartCount());
			setCartItems(getCart());
			setWishlistCount(getWishlist().length);
			setCompareCount(getCompareList().length);
		};

		window.addEventListener("rumer-cart-updated", handleCartUpdate);
		window.addEventListener("rumer-wishlist-updated", handleWishlistUpdate);
		window.addEventListener("rumer-compare-updated", handleCompareUpdate);
		window.addEventListener("storage", handleStorage);
		return () => {
			window.removeEventListener("rumer-cart-updated", handleCartUpdate);
			window.removeEventListener("rumer-wishlist-updated", handleWishlistUpdate);
			window.removeEventListener("rumer-compare-updated", handleCompareUpdate);
			window.removeEventListener("storage", handleStorage);
		};
	}, []);

	useEffect(() => {
		document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [mobileMenuOpen]);

	const updateParams = (updates: Record<string, string>) => {
		const params = new URLSearchParams(searchParams.toString());
		Object.entries(updates).forEach(([key, value]) => {
			if (value) {
				params.set(key, value);
			} else {
				params.delete(key);
			}
		});
		const query = params.toString();
		router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		updateParams({ search: searchQuery });
	};

	const handleLocationChange = (state: string) => {
		setLocation(state);
		updateParams({ state: state === "Lagos" ? "" : state });
	};

	const handleCategoryClick = (label: string) => {
		const categoryMap: Record<string, string> = {
			"Goat": "Goat",
			"Cow": "Cow",
			"Hens": "Hens",
			"Turkey": "Turkey",
			"Farm Inputs": "Farm Inputs",
			"Wholesales": "Wholesales",
			"Retail Packs": "Retail Packs",
		};

		const livestockType = categoryMap[label];
		if (!livestockType) return;
		updateParams({
			livestockType: activeLivestockType === livestockType ? "" : livestockType,
		});
		setCategoryDropdownOpen(false);
	};

	const handleProductTypeTab = (type: "livestock" | "processed") => {
		updateParams({
			productType: activeProductType === type ? "" : type,
		});
	};

	const handleNavLink = (href: string) => {
		setMobileMenuOpen(false);
		router.push(href);
	};

	return (
		<header className='w-full z-50 relative'>
			{/* Top Bar */}
			<div className='bg-[#014834] text-white text-sm'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between'>
					<p className='hidden sm:block'>Welcome to Rumer.</p>
					<div className='flex items-center gap-4 sm:gap-6 ml-auto'>
						<div className='hidden md:flex items-center gap-3'>
							<span className='text-white/80 text-xs'>Follow us:</span>
							<div className='flex items-center gap-2.5'>
								<Facebook className='w-4 h-4' />
								<Youtube className='w-4 h-4' />
								<Instagram className='w-4 h-4' />
							</div>
						</div>

						<div className='hidden sm:flex items-center gap-1 cursor-pointer hover:text-white/80 transition-colors relative group'>
							<span>{language}</span>
							<ChevronDown className='w-3 h-3' />
							<div className='absolute top-full right-0 mt-1 w-24 bg-white text-gray-800 rounded-lg shadow-lg py-1 hidden group-hover:block'>
								{["Eng", "Fr", "Ha"].map((lang) => (
									<button
										key={lang}
										onClick={() => setLanguage(lang)}
										className='block w-full text-left px-3 py-2 text-sm hover:bg-gray-50'
									>
										{lang}
									</button>
								))}
							</div>
						</div>

						<div className='hidden sm:flex items-center gap-1 cursor-pointer hover:text-white/80 transition-colors relative group'>
							<span>{currency}</span>
							<ChevronDown className='w-3 h-3' />
							<div className='absolute top-full right-0 mt-1 w-28 bg-white text-gray-800 rounded-lg shadow-lg py-1 hidden group-hover:block'>
								{["Naria", "USD"].map((curr) => (
									<button
										key={curr}
										onClick={() => setCurrency(curr)}
										className='block w-full text-left px-3 py-2 text-sm hover:bg-gray-50'
									>
										{curr}
									</button>
								))}
							</div>
						</div>

						<div className='flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded cursor-pointer relative group'>
							<div className='w-5 h-5 rounded-full bg-green-500 border border-white/30 flex items-center justify-center text-[10px] font-bold overflow-hidden'>
								<span className='scale-75'>🇳🇬</span>
							</div>
							<span>NG</span>
							<ChevronDown className='w-3 h-3' />
							<div className='absolute top-full right-0 mt-1 w-40 bg-white text-gray-800 rounded-lg shadow-lg py-1 hidden group-hover:block max-h-60 overflow-y-auto'>
								<button className='block w-full text-left px-3 py-2 text-sm hover:bg-gray-50'>
									Nigeria
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Navbar */}
			<div className='bg-white border-b border-gray-100'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<div className='flex items-center justify-between gap-4 lg:gap-8'>
						{/* Logo + Mobile Menu */}
						<div className='flex items-center gap-3'>
							<button
								className='lg:hidden p-2 -ml-2 text-gray-700 hover:text-[#014834]'
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								aria-label='Toggle menu'
							>
								{mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
							</button>
							<Link href='/marketplace'>
								<Picture src={rummerLogoGreen} alt='Rummer-logo' className='!w-[90px] lg:!w-[110px] object-contain' />
							</Link>
						</div>

						{/* Location Selector - Desktop */}
						<div className='hidden lg:flex items-center gap-2 border-2 border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-[#014834] transition-colors relative group'>
							<MapPin className='w-4 h-4 text-[#014834]' />
							<span className='text-sm font-bold text-gray-900'>{location}</span>
							<ChevronDown className='w-4 h-4 text-gray-600' />
							<div className='absolute top-full left-0 mt-1 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-1 hidden group-hover:block max-h-60 overflow-y-auto z-50 border border-gray-100'>
								{nigerianStates.map((state) => (
									<button
										key={state}
										onClick={() => handleLocationChange(state)}
										className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${location === state ? "bg-green-50 text-[#014834]" : ""}`}
									>
										{state}
									</button>
								))}
							</div>
						</div>

						{/* Search Bar */}
						<form onSubmit={handleSearch} className='flex-1 max-w-2xl hidden md:block'>
							<div className='relative'>
								<input
									type='text'
									placeholder='Search for anything...'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className='w-full pl-4 pr-12 py-2.5 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#014834] focus:ring-1 focus:ring-[#014834] text-sm font-medium text-gray-900 placeholder-gray-500'
								/>
								<button
									type='submit'
									className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#014834] text-white rounded-md hover:bg-[#013628] transition-colors'
								>
									<Search className='w-4 h-4' />
								</button>
							</div>
						</form>

						{/* Right Actions */}
						<div className='flex items-center gap-2 sm:gap-4'>
							<div className='relative'>
								<button
									onClick={() => setCartOpen(!cartOpen)}
									className='relative p-2 text-gray-900 hover:text-[#014834] transition-colors'
									aria-label='Cart'
								>
									<ShoppingCart className='w-5 h-5 sm:w-6 sm:h-6' />
									{cartCount > 0 && (
										<span className='absolute top-0 right-0 w-4 h-4 bg-[#014834] text-white text-[10px] font-bold rounded-full flex items-center justify-center'>
											{cartCount}
										</span>
									)}
								</button>

								<AnimatePresence>
									{cartOpen && (
										<>
											<div className='fixed inset-0 z-40' onClick={() => setCartOpen(false)} />
											<motion.div
												initial={{ opacity: 0, y: -10, scale: 0.95 }}
												animate={{ opacity: 1, y: 0, scale: 1 }}
												exit={{ opacity: 0, y: -10, scale: 0.95 }}
												transition={{ duration: 0.2 }}
												className='absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden'
											>
												<div className='p-4'>
													<h3 className='text-lg font-bold text-gray-900 mb-4'>
														Shopping Cart <span className='text-gray-500 font-normal'>({String(cartCount).padStart(2, "0")})</span>
													</h3>

													{cartItems.length === 0 ? (
														<p className='text-gray-500 text-sm py-4 text-center'>Your cart is empty</p>
													) : (
														<>
															<div className='space-y-4 max-h-64 overflow-y-auto'>
																{cartItems.map((item) => (
																	<div key={item.id} className='flex gap-3'>
																		<img
																			src={item.image || "https://placehold.co/80x80/png?text=No+Image"}
																			alt={item.name}
																			className='w-16 h-16 rounded-lg object-cover flex-shrink-0'
																		/>
																		<div className='flex-1 min-w-0'>
																			<p className='text-sm font-medium text-gray-900 line-clamp-2'>{item.name}</p>
																			<p className='text-sm font-bold text-gray-900 mt-1'>
																				{item.quantity} x {formatNaira(item.price)}
																			</p>
																		</div>
																		<button
																			onClick={() => {
																				removeFromCart(item.id);
																				setCartItems(getCart());
																				setCartCount(getCartCount());
																			}}
																			className='text-gray-400 hover:text-red-500 transition-colors flex-shrink-0'
																		>
																			<X className='w-4 h-4' />
																		</button>
																	</div>
																))}
															</div>

															<div className='border-t border-gray-200 mt-4 pt-4'>
																<div className='flex justify-between items-center mb-4'>
																	<span className='text-sm text-gray-600'>Sub-Total:</span>
																	<span className='text-sm font-bold text-gray-900'>{formatNaira(getCartTotal())} NGN</span>
																</div>

																<button
																	onClick={() => {
																		setCartOpen(false);
																		router.push("/marketplace/cart");
																	}}
																	className='w-full py-3 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mb-2'
																>
																	CHECKOUT NOW <span className='text-lg'>→</span>
																</button>

																<button
																	onClick={() => {
																		setCartOpen(false);
																		router.push("/marketplace/cart");
																	}}
																	className='w-full py-3 border-2 border-gray-300 text-gray-900 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors'
																>
																	VIEW CART
																</button>
															</div>
														</>
													)}
												</div>
											</motion.div>
										</>
									)}
								</AnimatePresence>
							</div>

							<Link href='/marketplace/wishlist' className='hidden sm:block relative p-2 text-gray-900 hover:text-[#014834] transition-colors' aria-label='Wishlist'>
								<Heart className='w-5 h-5 sm:w-6 sm:h-6' />
								{wishlistCount > 0 && (
									<span className='absolute top-0 right-0 w-4 h-4 bg-[#014834] text-white text-[10px] font-bold rounded-full flex items-center justify-center'>
										{wishlistCount}
									</span>
								)}
							</Link>

							<div className='hidden sm:block'>
								<NotificationBell variant='light' />
							</div>

							{isLoggedIn ? (
								<div className='relative'>
									<button
										onClick={() => setUserMenuOpen(!userMenuOpen)}
										className='flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 border-2 border-gray-300 transition-colors'
									>
										{user?.profile_picture ? (
											<img src={user.profile_picture} alt={userName} className='w-8 h-8 rounded-full object-cover' />
										) : (
											<div className='w-8 h-8 rounded-full bg-[#014834] text-white flex items-center justify-center text-xs font-bold'>
												{initials || "U"}
											</div>
										)}
										<span className='hidden sm:block text-sm font-bold text-gray-900 max-w-[100px] truncate'>
											{userName || "Account"}
										</span>
										<ChevronDown className='w-4 h-4 text-gray-600' />
									</button>

									<AnimatePresence>
										{userMenuOpen && (
											<>
												<div className='fixed inset-0 z-40' onClick={() => setUserMenuOpen(false)} />
												<motion.div
													initial={{ opacity: 0, y: -10, scale: 0.95 }}
													animate={{ opacity: 1, y: 0, scale: 1 }}
													exit={{ opacity: 0, y: -10, scale: 0.95 }}
													transition={{ duration: 0.2 }}
													className='absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden py-1'
												>
													<button
														onClick={() => {
															setUserMenuOpen(false);
															router.push("/marketplace/account");
														}}
														className='w-full px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3'
													>
														<User className='w-4 h-4 text-gray-500' />
														Account Settings
													</button>
													<div className='border-t border-gray-100' />
													<button
														onClick={() => {
															setUserMenuOpen(false);
															signOut();
														}}
														className='w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3'
													>
														<X className='w-4 h-4' />
														Logout
													</button>
												</motion.div>
											</>
										)}
									</AnimatePresence>
								</div>
							) : (
								<>
									<Link href='/login' className='hidden sm:block p-2 text-gray-900 hover:text-[#014834] transition-colors' aria-label='Account'>
										<User className='w-5 h-5 sm:w-6 sm:h-6' />
									</Link>
									<Link
										href='/signup'
										className='flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors'
									>
										Sign Up
										<span className='text-lg leading-none'>→</span>
									</Link>
								</>
							)}
						</div>
					</div>

					{/* Mobile Search */}
					<form onSubmit={handleSearch} className='mt-3 md:hidden'>
						<div className='relative'>
							<input
								type='text'
								placeholder='Search for anything...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='w-full pl-4 pr-12 py-2.5 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#014834] text-sm font-medium text-gray-900 placeholder-gray-500'
							/>
							<button
								type='submit'
								className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#014834] text-white rounded-md'
							>
								<Search className='w-4 h-4' />
							</button>
						</div>
					</form>
				</div>
			</div>

			{/* Secondary Navbar - Desktop */}
			<div className='hidden lg:block bg-white border-b border-gray-100'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-8'>
							<div className='relative'>
								<button
									onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
									className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-900 border-2 border-gray-300 transition-colors'
								>
									<span>All Category</span>
									<ChevronDown className={`w-4 h-4 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`} />
								</button>

								<AnimatePresence>
									{categoryDropdownOpen && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											className='absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-3 z-50'
										>
											<p className='px-4 text-xs font-bold text-gray-500 uppercase mb-2'>Category</p>
											<div className='max-h-[400px] overflow-y-auto'>
												{marketplaceCategories.map((category) => (
													<button
														key={category.label}
														onClick={() => handleCategoryClick(category.label)}
														className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
															activeLivestockType === category.label
																? "text-[#014834] bg-green-50"
																: "text-gray-700 hover:bg-gray-50"
														}`}
													>
														<span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
															activeLivestockType === category.label
																? "border-[#014834] bg-[#014834]"
																: "border-gray-300"
														}`}>
															{activeLivestockType === category.label && (
																<span className='w-2 h-2 rounded-full bg-white' />
															)}
														</span>
														<span>{category.label}</span>
													</button>
												))}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

						{topBarLinks.map((link) => (
							<button
								key={link.label}
								onClick={() => handleNavLink(link.href)}
								className='text-sm font-medium text-gray-900 hover:text-[#014834] transition-colors relative'
							>
								{link.label}
								{link.label === "Compare" && compareCount > 0 && (
									<span className='absolute -top-2 -right-4 min-w-[18px] h-[18px] bg-[#014834] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1'>
										{compareCount}
									</span>
								)}
							</button>
						))}
						</div>

						<div className='flex items-center gap-1 bg-gray-100 p-1 rounded-lg'>
							<button
								onClick={() => handleProductTypeTab("livestock")}
								className={`px-5 py-1.5 text-sm font-medium rounded-md transition-colors ${
									activeProductType === "livestock"
										? "bg-[#014834] text-white shadow-sm"
										: "text-gray-600 hover:bg-white"
								}`}
							>
								Live Animals
							</button>
							<button
								onClick={() => handleProductTypeTab("processed")}
								className={`px-5 py-1.5 text-sm font-medium rounded-md transition-colors ${
									activeProductType === "processed"
										? "bg-[#014834] text-white shadow-sm"
										: "text-gray-600 hover:bg-white"
								}`}
							>
								Processed
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Sidebar Menu */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							onClick={() => setMobileMenuOpen(false)}
							className='fixed inset-0 bg-black/50 z-[60] lg:hidden'
						/>

						{/* Sidebar */}
						<motion.aside
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
							className='fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] lg:hidden flex flex-col shadow-2xl'
						>
							{/* Sidebar Header */}
							<div className='flex items-center gap-3 px-4 py-4 border-b border-gray-100'>
								<button
									onClick={() => setMobileMenuOpen(false)}
									className='p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors'
									aria-label='Close menu'
								>
									<X className='w-6 h-6' />
								</button>
								<Picture src={rummerLogoGreen} alt='Rummer-logo' className='!w-[90px] object-contain' />
							</div>

							{/* Sidebar Content */}
							<div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
								{/* Location Selector */}
								<div className='relative'>
									<button
										onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
										className='flex items-center justify-between w-full px-3 py-3 bg-white border border-gray-200 rounded-lg'
									>
										<div className='flex items-center gap-2'>
											<MapPin className='w-4 h-4 text-[#014834]' />
											<span className='text-sm font-semibold text-gray-900'>{location}</span>
										</div>
										<ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`} />
									</button>

									<AnimatePresence>
										{categoryDropdownOpen && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												className='overflow-hidden mt-2'
											>
											{nigerianStates.map((state) => (
												<button
													key={state}
													onClick={() => handleLocationChange(state)}
													className={`block w-full text-left px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-lg ${location === state ? "bg-green-50 text-[#014834]" : ""}`}
												>
													{state}
												</button>
											))}
											</motion.div>
										)}
									</AnimatePresence>
								</div>

								{/* Categories Collapsible */}
								<div>
									<button
										onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
										className='w-full flex items-center justify-between px-3 py-3 bg-white border border-gray-200 rounded-lg'
									>
										<div className='flex items-center gap-2'>
											<span className='text-sm font-semibold text-gray-900'>Categories</span>
											{activeLivestockType && (
												<span className='text-xs bg-[#014834] text-white px-2 py-0.5 rounded-full'>
													{activeLivestockType}
												</span>
											)}
										</div>
										<ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
									</button>

									<AnimatePresence>
										{mobileCategoriesOpen && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												className='overflow-hidden'
											>
												<p className='px-3 text-xs font-bold text-gray-500 uppercase mt-3 mb-2'>Category</p>
												<div className='flex flex-col gap-1 max-h-[300px] overflow-y-auto'>
													{marketplaceCategories.map((category) => (
														<button
															key={category.label}
															onClick={() => handleCategoryClick(category.label)}
															className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
																activeLivestockType === category.label ? 'bg-green-50 text-[#014834]' : 'text-gray-700 hover:bg-gray-50'
															}`}
														>
															<span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
																activeLivestockType === category.label
																	? "border-[#014834] bg-[#014834]"
																	: "border-gray-300"
															}`}>
																{activeLivestockType === category.label && (
																	<span className='w-2 h-2 rounded-full bg-white' />
																)}
															</span>
															<span className='truncate'>{category.label}</span>
														</button>
													))}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>

								{/* Product Type Tabs */}
								<div className='flex gap-2'>
									<button
										onClick={() => handleProductTypeTab("livestock")}
										className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-colors border ${
											activeProductType === "livestock" ? "bg-[#014834] text-white border-[#014834]" : "bg-white text-gray-900 border-gray-200 hover:border-gray-300"
										}`}
									>
										Live Animals
									</button>
									<button
										onClick={() => handleProductTypeTab("processed")}
										className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-colors border ${
											activeProductType === "processed" ? "bg-[#014834] text-white border-[#014834]" : "bg-white text-gray-900 border-gray-200 hover:border-gray-300"
										}`}
									>
										Processed
									</button>
								</div>

								{/* Quick Links */}
								<div>
									<p className='text-xs font-bold text-gray-600 uppercase px-1 mb-2'>Quick Links</p>
									<div className='flex flex-col gap-2'>
										{topBarLinks.slice(0, 4).map((link) => (
											<button
												key={link.label}
												onClick={() => handleNavLink(link.href)}
												className='text-left px-3 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg transition-colors relative'
											>
												{link.label}
												{link.label === "Compare" && compareCount > 0 && (
													<span className='absolute top-1 right-1 min-w-[18px] h-[18px] bg-[#014834] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1'>
														{compareCount}
													</span>
												)}
											</button>
										))}
									</div>
								</div>
							</div>

							{/* Sidebar Footer */}
							<div className='px-4 py-4 border-t border-gray-100 space-y-2'>
								{isLoggedIn ? (
									<>
										<button
											onClick={() => handleNavLink("/notifications")}
											className='w-full py-3 border border-gray-300 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors'
										>
											Notifications
										</button>
										<button
											onClick={() => handleNavLink("/dashboard")}
											className='w-full py-3 bg-[#014834] text-white text-sm font-medium rounded-lg hover:bg-[#013628] transition-colors'
										>
											Go to Dashboard
										</button>
									</>
								) : (
									<div className='flex flex-col gap-2'>
										<button
											onClick={() => handleNavLink("/login")}
											className='w-full py-3 border border-black text-black text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors'
										>
											Sign In
										</button>
										<button
											onClick={() => handleNavLink("/signup")}
											className='w-full py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors'
										>
											Sign Up
										</button>
									</div>
								)}
							</div>
						</motion.aside>
					</>
				)}
			</AnimatePresence>
		</header>
	);
}
