"use client";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { RummerLogo } from "../utils/functions";
import { NAV_ITEMS } from "../utils/constants";
import { FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useQuery } from "react-query";
import { getPageDataById } from "../utils/endpoint";
import { APICall } from "../utils/extras";
import Link from "next/link";

interface MobileNavProps {
	isOpen: boolean;
	onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
	let homeId = 5;
	const [expandedItems, setExpandedItems] = useState<string[]>([]);

	const toggleExpanded = (label: string) => {
		setExpandedItems((prev) =>
			prev.includes(label)
				? prev.filter((l) => l !== label)
				: [...prev, label]
		);
	};

	const { data: homeData, isLoading: homeLoading } = useQuery(
		["home-page"],
		async () => {
			const response = await APICall(getPageDataById, [homeId], false, false);
			return response.data;
		},
		{
			staleTime: Infinity,
			refetchOnWindowFocus: true,
		},
	);

	const HomeData = homeData;

	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
		exit: {
			opacity: 0,
			transition: {
				staggerChildren: 0.05,
				staggerDirection: -1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, x: -20 },
		show: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -20 },
	};

	return (
		<Dialog.Root open={isOpen} onOpenChange={onClose}>
			<AnimatePresence mode='wait'>
				{isOpen && (
					<Dialog.Portal forceMount>
						<Dialog.Overlay asChild>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
								className='fixed inset-0 bg-black-100/20 backdrop-blur-sm z-40 lg:hidden'
							/>
						</Dialog.Overlay>

						<Dialog.Content asChild>
							<motion.div
								initial={{ x: "100%" }}
								animate={{ x: 0 }}
								exit={{ x: "100%" }}
								transition={{
									type: "spring",
									damping: 30,
									stiffness: 300,
									mass: 0.8,
								}}
								className='fixed top-0 right-0 h-full w-full max-w-[300px] bg-white shadow-2xl z-50 lg:hidden focus:outline-none border-l border-gray-100'
							>
								<div className='flex flex-col h-full'>
									{/* Header */}
									<div className='flex items-center justify-between p-6 border-b border-gray-100/50'>
										<div className='scale-90 origin-left'>
											<RummerLogo />
										</div>
										<Dialog.Close asChild>
											<button className='p-2 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 group'>
												<FiX className='w-5 h-5 group-hover:rotate-90 transition-transform duration-300' />
											</button>
										</Dialog.Close>
									</div>

									{/* Hidden DialogTitle for accessibility */}
									<Dialog.Title className='sr-only'>
										Mobile Navigation Menu
									</Dialog.Title>

									{/* Navigation Items */}
									<nav className='flex-1 overflow-y-auto px-4 py-6'>
									<motion.ul
										variants={containerVariants}
										initial='hidden'
										animate='show'
										exit='exit'
										className='space-y-2'
									>
										{NAV_ITEMS.map((item) => (
											<motion.li key={item.label} variants={itemVariants}>
												{item.label === "Products" && item.submenu ? (
													<div>
														<button
															onClick={() => toggleExpanded(item.label)}
															className='flex items-center justify-between w-full py-3 px-4 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 font-medium text-sm'
														>
															<span>{item.label}</span>
															{expandedItems.includes(item.label) ? (
																<FiChevronUp className='w-4 h-4' />
															) : (
																<FiChevronDown className='w-4 h-4' />
															)}
														</button>
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
																				className='flex items-center justify-between py-2.5 px-3 text-sm text-gray-400 cursor-not-allowed'
																			>
																				<span>{sub.label}</span>
																				<span className='text-[10px] bg-[#014834] text-white px-2 py-0.5 rounded-full whitespace-nowrap'>
																					Coming Soon
																				</span>
																			</div>
																		) : (
																			<Dialog.Close asChild>
																				<a
																					href={sub.href}
																					className='flex items-center justify-between py-2.5 px-3 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium'
																				>
																					<span>{sub.label}</span>
																				</a>
																			</Dialog.Close>
																		)}
																	</li>
																))}
															</ul>
														</motion.div>
													</div>
												) : (
													<Dialog.Close asChild>
														<a
															href={item.href}
															className='block py-3 px-4 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 font-medium text-sm'
														>
															{item.label}
														</a>
													</Dialog.Close>
												)}
											</motion.li>
										))}
									</motion.ul>
									</nav>

									{/* Footer */}
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.4 }}
										className='p-6 border-t border-gray-100 bg-gray-50/50'
									>
										<Link
											href='/give'
											className='w-full block text-center bg-primary-100 hover:bg-primary-600 hover:text-white text-black font-semibold px-5 py-3 rounded-xl shadow-sm transition-all duration-300 active:scale-95'
										>
											Give
										</Link>

										<div className='mt-6 text-center text-xs text-gray-500'>
											<p className='font-semibold text-gray-700 mb-1'>Rummer</p>
											<p>Worship with us.</p>
										</div>
									</motion.div>
								</div>
							</motion.div>
						</Dialog.Content>
					</Dialog.Portal>
				)}
			</AnimatePresence>
		</Dialog.Root>
	);
};

export default MobileNav;
