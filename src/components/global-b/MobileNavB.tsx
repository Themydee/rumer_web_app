"use client";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { RummerLogo } from "../utils/functions";
import { FiX, FiChevronDown, FiChevronUp, FiExternalLink, FiLogOut, FiGrid } from "react-icons/fi";
import styles from "../../app/css/Scrollbar.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/components/hooks";
import { signOut } from "@/components/utils/data";

interface SubmenuItem {
	label: string;
	href: string;
	comingSoon?: boolean;
}

interface NavItem {
	label: string;
	href: string;
	submenu?: SubmenuItem[];
}

interface MobileNavBProps {
	isOpen: boolean;
	onClose: () => void;
	navItems: NavItem[];
	showMarketplaceButton?: boolean;
}

const MobileNavB = ({ isOpen, onClose, navItems, showMarketplaceButton = true }: MobileNavBProps) => {
	const [showMobileSolutions, setShowMobileSolutions] = useState(false);
	const [expandedItems, setExpandedItems] = useState<string[]>([]);
	const { user } = useAppSelector((state) => state.auth);
	const router = useRouter();

	const isLoggedIn = !!user;
	const userName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
	const initials = userName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const toggleExpanded = (label: string) => {
		setExpandedItems((prev) =>
			prev.includes(label)
				? prev.filter((l) => l !== label)
				: [...prev, label]
		);
	};

	const toggleMobileSolutions = () => {
		setShowMobileSolutions(!showMobileSolutions);
	};

	const handleTraderClick = (e: React.MouseEvent) => {
		e.preventDefault();
		onClose();
		if (!user) {
			router.push("/trader");
		} else if ((user as any).business_type === "trader") {
			router.push("/dashboard");
		} else {
			router.push("/trader");
		}
	};

	const containerVariants = {
		hidden: { x: "100%" },
		visible: {
			x: 0,
			transition: {
				type: "spring",
				damping: 25,
				stiffness: 200,
				mass: 0.8,
				when: "beforeChildren",
				staggerChildren: 0.05,
			},
		},
		exit: {
			x: "100%",
			transition: {
				type: "tween",
				ease: "easeInOut",
				duration: 0.2,
				when: "afterChildren",
			},
		},
	};

	const overlayVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 0.5,
			transition: { duration: 0.3, ease: "easeOut" },
		},
		exit: {
			opacity: 0,
			transition: { duration: 0.2, ease: "easeIn" },
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring" as const,
				stiffness: 300,
				damping: 20,
				duration: 0.2,
			},
		},
		exit: {
			opacity: 0,
			y: 10,
			transition: { duration: 0.1 },
		},
	} satisfies Variants;

	const solutionsVariants = {
		hidden: {
			opacity: 0,
			height: 0,
			marginTop: 0,
			marginBottom: 0,
			transition: {
				height: { duration: 0.2, ease: "easeInOut" },
				opacity: { duration: 0.1, delay: 0 },
			},
		},
		visible: {
			opacity: 1,
			height: "auto",
			marginTop: "0.75rem", // my-3
			marginBottom: "0.75rem", // my-3
			transition: {
				height: { duration: 0.3, ease: "easeInOut" },
				opacity: { duration: 0.2, delay: 0.1 },
			},
		},
	};

	const innerSolutionsVariants = {
		hidden: { opacity: 0, scale: 0.95 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.2,
				delay: 0.15,
				ease: "easeOut",
			},
		},
	};

	const buttonHoverAnimation = {
		scale: 1.02,
		transition: { duration: 0.2 },
	};

	const tapAnimation = {
		scale: 0.98,
		transition: { duration: 0.1 },
	};

	return (
		<Dialog.Root open={isOpen} onOpenChange={onClose}>
			<Dialog.Portal>
				<Dialog.Overlay asChild>
					<motion.div
						// @ts-ignore
						variants={overlayVariants}
						initial='hidden'
						animate='visible'
						exit='exit'
						className='fixed inset-0 bg-black-100/10 z-40 lg:hidden'
					/>
				</Dialog.Overlay>

				<Dialog.Content asChild>
					<motion.div
						// @ts-ignore
						variants={containerVariants}
						initial='hidden'
						animate='visible'
						exit='exit'
						className='fixed top-0 right-0 h-full w-full max-w-[95vw] bg-white shadow-2xl z-50 lg:hidden focus:outline-none overflow-hidden'
					>
						<div className='flex flex-col h-full'>
							{/* Header */}
							<motion.div
								className='flex items-center justify-between p-6 pb-1'
								// @ts-ignore
								variants={itemVariants}
							>
								<RummerLogo isGreen className='' />
								<Dialog.Close asChild>
									<motion.button
										whileHover={{ scale: 1.1, rotate: 90 }}
										whileTap={{ scale: 0.9 }}
										transition={{ type: "spring", stiffness: 400, damping: 17 }}
										className='p-2 text-gray-600 hover:text-primary-400 rounded-full hover:bg-gray-100'
									>
										<FiX className='w-6 h-6' />
									</motion.button>
								</Dialog.Close>
							</motion.div>

							{/* Hidden DialogTitle for accessibility */}
							<Dialog.Title className='sr-only'>
								Mobile Navigation Menu
							</Dialog.Title>

							{/* Navigation Items */}
							<nav
								className={`flex-1 overflow-y-auto ${styles["inner-sidebar-scroll"]} px-3 pb-4`}
							>
								<motion.ul
									className='space-y-1 py-4'
									variants={{
										visible: { transition: { staggerChildren: 0.05 } },
									}}
								>
									{navItems.map((item, index) => (
										<motion.li
											key={item.label}
											// @ts-ignore
											variants={itemVariants}
											custom={index}
										>
											{item.label === "Solutions" ? (
												<motion.button
													onClick={() => {
														const element =
															document.getElementById("solutions");
														if (element) {
															element.scrollIntoView({ behavior: "smooth" });
															onClose();
														}
													}}
													whileHover={buttonHoverAnimation}
													whileTap={tapAnimation}
													className='flex items-center justify-between w-full py-2 px-2 text-black-100 hover:text-primary-400 hover:bg-gray-50 rounded-xl font-medium'
												>
													<span>{item.label}</span>
												</motion.button>
											) : item.label === "Visit Rumer Market" ? (
												<Dialog.Close asChild>
													<Link
														href="/marketplace"
														className='block py-4 px-2 text-black-100 hover:text-primary-400 hover:bg-gray-50 rounded-xl font-medium'
													>
														{item.label}
													</Link>
												</Dialog.Close>
											) : item.submenu ? (
												<div>
													<motion.button
														onClick={() => toggleExpanded(item.label)}
														whileHover={buttonHoverAnimation}
														whileTap={tapAnimation}
														className='flex items-center justify-between w-full py-4 px-2 text-black-100 hover:text-primary-400 hover:bg-gray-50 rounded-xl font-medium'
													>
														<span>{item.label}</span>
														{expandedItems.includes(item.label) ? (
															<FiChevronUp className='w-5 h-5' />
														) : (
															<FiChevronDown className='w-5 h-5' />
														)}
													</motion.button>
													<motion.div
														initial={false}
														animate={{
															height: expandedItems.includes(item.label) ? "auto" : 0,
															opacity: expandedItems.includes(item.label) ? 1 : 0,
														}}
														transition={{ duration: 0.2, ease: "easeInOut" }}
														className='overflow-hidden'
													>
												<ul className='pl-4 py-1 space-y-1'>
													{item.submenu.map((sub) => (
														<li key={sub.label}>
															{sub.comingSoon ? (
																<div
																	aria-disabled='true'
																	className='flex items-center justify-between py-3 px-3 text-sm text-gray-400 cursor-not-allowed'
																>
																	<span>{sub.label}</span>
																	<span className='text-[10px] bg-[#014834] text-white px-2 py-0.5 rounded-full whitespace-nowrap'>
																		Coming Soon
																	</span>
																</div>
															) : sub.label === "Rumer Trader" ? (
																<button
																	onClick={handleTraderClick}
																	className='flex items-center justify-between w-full py-3 px-3 text-sm text-gray-600 hover:text-primary-400 hover:bg-gray-50 rounded-lg font-medium text-left'
																>
																	<span>{sub.label}</span>
																</button>
															) : (
																<Dialog.Close asChild>
																	<Link
																		href={sub.href}
																		className='flex items-center justify-between py-3 px-3 text-sm text-gray-600 hover:text-primary-400 hover:bg-gray-50 rounded-lg font-medium'
																	>
																		<span>{sub.label}</span>
																	</Link>
																</Dialog.Close>
															)}
														</li>
													))}
												</ul>
													</motion.div>
												</div>
											) : (
												<Dialog.Close asChild>
													<motion.a
														href={item.href}
														whileHover={buttonHoverAnimation}
														whileTap={tapAnimation}
														className='block py-4 px-2 text-black-100 hover:text-primary-400 hover:bg-gray-50 rounded-xl font-medium'
													>
														{item.label}
													</motion.a>
												</Dialog.Close>
											)}
										</motion.li>
									))}
							</motion.ul>

							{/* Go to Marketplace */}
							{showMarketplaceButton && (
								<motion.div
									variants={itemVariants}
									className='px-2 pt-2 pb-6'
								>
									<Dialog.Close asChild>
										<Link
											href='/marketplace'
											className='flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-[#014834] text-white font-medium hover:bg-[#013628] transition-colors'
										>
											<span>Go to Marketplace</span>
											<FiExternalLink className='w-4 h-4' />
										</Link>
									</Dialog.Close>
								</motion.div>
							)}

							{/* Auth Buttons */}
							{!showMarketplaceButton && (
								isLoggedIn ? (
									<motion.div
										variants={itemVariants}
										className='px-2 pt-2 pb-6 flex flex-col gap-3'
									>
										{/* User Info */}
										<div className='flex items-center gap-3 px-2 py-2'>
											{user?.profile_picture ? (
												<img
													src={user.profile_picture}
													alt={userName || "User"}
													className='w-10 h-10 rounded-full object-cover'
												/>
											) : (
												<div className='w-10 h-10 rounded-full bg-[#014834] text-white flex items-center justify-center text-sm font-bold'>
													{initials || "U"}
												</div>
											)}
											<span className='text-sm font-bold text-gray-900 truncate'>
												{userName || "Account"}
											</span>
										</div>
										<Dialog.Close asChild>
											<Link
												href='/dashboard'
												className='flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-[#014834] text-white font-medium hover:bg-[#013628] transition-colors'
											>
												<FiGrid className='w-4 h-4' />
												<span>Dashboard</span>
											</Link>
										</Dialog.Close>
										<button
											onClick={() => {
												onClose();
												signOut();
											}}
											className='flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors'
										>
											<FiLogOut className='w-4 h-4' />
											<span>Sign Out</span>
										</button>
									</motion.div>
								) : (
									<motion.div
										variants={itemVariants}
										className='px-2 pt-2 pb-6 flex flex-col gap-3'
									>
										<Dialog.Close asChild>
											<Link
												href='/login'
												className='flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl border border-black-100 text-black-100 font-medium hover:bg-gray-50 transition-colors'
											>
												<span>Sign In</span>
											</Link>
										</Dialog.Close>
										<Dialog.Close asChild>
											<Link
												href='/signup'
												className='flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-black-100 text-white font-medium hover:bg-black-100/80 transition-colors'
											>
												<span>Sign Up</span>
											</Link>
										</Dialog.Close>
									</motion.div>
								)
							)}
							</nav>
						</div>
					</motion.div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default MobileNavB;
