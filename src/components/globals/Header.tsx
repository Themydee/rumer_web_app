"use client";
import React, { useState } from "react";
import { RummerLogo } from "../utils/functions";
import { FiMenu, FiX } from "react-icons/fi";
import MobileNav from "./MobileNav";
import { usePathname } from "next/navigation";
import { APICall } from "../utils/extras";
import { useQuery } from "react-query";
import { getPageDataById } from "../utils/endpoint";
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { NAV_ITEMS } from "../utils/constants";

const Header = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
		// Prevent body scroll when mobile menu is open
		document.body.style.overflow = isMobileMenuOpen ? "unset" : "hidden";
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
		document.body.style.overflow = "unset";
	};

	return (
		<header
			className='w-full bg-bg-200 shadow-sm z-50 fixed top-0 backdrop-blur-[28.1px] border-b border-transparent bg-clip-padding'
			style={{
				borderImage:
					"linear-gradient(90deg, rgba(61, 61, 61, 0) 0%, #47BA92 45.19%, rgba(163, 163, 163, 0) 99.04%) 1",
			}}
		>
			<div className='max-w-7xl mx-auto pl-2 pr-4 lg:px-2 py-3 grid grid-cols-10 items-center'>
				{/* Logo */}
				<div className='col-span-8 md:col-span-3 flex items-center'>
					<RummerLogo />
				</div>

				{/* Desktop Navigation */}
				<nav className='hidden md:flex justify-center items-center gap-12 text-white col-span-4'>
					{NAV_ITEMS.map((item) => (
						<div key={item.label} className='relative group/products'>
							{item.label === "Products" ? (
								<button
									className={`flex items-center gap-1 hover:text-primary-500 transition-colors duration-200 ${
										pathname === "/marketplace" ? "text-primary-500" : ""
									}`}
								>
									{item.label}
									<ChevronDown className='w-4 h-4 transition-transform duration-200 group-hover/products:rotate-180' />
								</button>
							) : (
								<a
									href={item.href}
									className={`hover:text-primary-500 transition-colors duration-200 ${
										pathname === item.href ? "text-primary-500" : ""
									}`}
								>
									{item.label}
								</a>
							)}

							{item.label === "Products" && item.submenu && (
								<div className='absolute top-full left-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover/products:opacity-100 group-hover/products:visible transition-all duration-200 py-2 z-50'>
									{item.submenu.map((sub) =>
										sub.comingSoon ? (
											<div
												key={sub.label}
												aria-disabled='true'
												className='flex items-center justify-between px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed'
											>
												<span>{sub.label}</span>
												<span className='text-[10px] bg-[#014834] text-white px-2 py-0.5 rounded-full whitespace-nowrap'>
													Coming Soon
												</span>
											</div>
										) : (
											<a
												key={sub.label}
												href={sub.href}
												className='flex items-center justify-between px-4 py-2.5 text-sm text-black-100 hover:text-primary-600 hover:bg-gray-50 transition-colors'
											>
												<span>{sub.label}</span>
											</a>
										)
									)}
								</div>
							)}
						</div>
					))}
				</nav>

				{/* Give button - Desktop */}
				<div className='hidden md:flex col-span-3 items-center justify-end gap-3'>
					<Link
						href=''
						className='border-white border text-sm font-light hover:border-primary-600 hover:bg-primary-600 text-white px-2 xl:px-5 py-2 rounded-md shadow transition'
					>
						Request a demo
					</Link>
					<Link
						href='/login'
						className='bg-primary-500 text-black-100 text-xs xl:text-sm font-light px-2 xl:px-5 py-2 rounded-md shadow hover:bg-primary-400 transition flex items-center gap-1'
					>
						Get Started
						<FaArrowRight />
					</Link>
				</div>

				{/* Mobile Menu Button */}
				<div className='col-span-2 flex md:hidden items-center justify-end'>
					<button
						onClick={toggleMobileMenu}
						className='p-2 text-white hover:text-primary-500 transition-colors'
						aria-label='Toggle mobile menu'
					>
						{isMobileMenuOpen ? (
							<FiX className='w-7 h-7' />
						) : (
							<FiMenu className='w-7 h-7' />
						)}
					</button>
				</div>
			</div>

			<MobileNav isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
		</header>
	);
};

export default Header;
