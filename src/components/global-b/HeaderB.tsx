"use client";

import React, { useState, useRef, useEffect } from "react";
import { RummerLogo } from "../utils/functions";
import { FiX, FiMenu } from "react-icons/fi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PiShoppingCartFill } from "react-icons/pi";
import Link from "next/link";
import MobileNavB from "./MobileNavB";
import { GetStartedLink } from "../reusables/button";
import CountrySelector2 from "../buttons/CountrySelector2";
import { ChevronDown } from "lucide-react";
import SolutionPills from "../reusables/SolutionPills";
import { NAV_ITEMS } from "../utils/constants";
import gsap from "gsap";
import { useAppSelector } from "@/components/hooks";
import { signOut } from "@/components/utils/data";

const HeaderB = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [showSolutions, setShowSolutions] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const { user } = useAppSelector((state) => state.auth);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isLoggedIn = mounted && !!user;
	const userName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
	const initials = userName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	// For hover delay
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Refs for GSAP animations
	const headerRef = useRef<HTMLHeadElement>(null);
	const logoRef = useRef<HTMLDivElement>(null);
	const navItemsRef = useRef<HTMLDivElement[]>([]);
	const buttonsRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const solutionButtonRef = useRef<HTMLButtonElement>(null);

	// GSAP timeline for header entrance
	useEffect(() => {
		const ctx = gsap.context(() => {
			// Staggered entrance animation
			gsap.fromTo(
				headerRef.current,
				{ y: -100, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 0.8,
					ease: "power3.out",
					delay: 0.2,
				},
			);

			// Logo animation
			gsap.fromTo(
				logoRef.current,
				{ scale: 0.8, opacity: 0 },
				{
					scale: 1,
					opacity: 1,
					duration: 0.6,
					ease: "back.out(1.7)",
					delay: 0.4,
				},
			);

			// Navigation items stagger
			gsap.fromTo(
				navItemsRef.current,
				{ y: -20, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 0.5,
					stagger: 0.08,
					ease: "power2.out",
					delay: 0.6,
				},
			);

			// Buttons animation
			gsap.fromTo(
				buttonsRef.current?.children || [],
				{ scale: 0, opacity: 0 },
				{
					scale: 1,
					opacity: 1,
					duration: 0.4,
					stagger: 0.1,
					ease: "back.out(1.5)",
					delay: 0.8,
				},
			);
		});

		return () => ctx.revert(); // Cleanup
	}, []);

	// Animation for solution dropdown
	useEffect(() => {
		if (!dropdownRef.current) return;

		const ctx = gsap.context(() => {
			if (showSolutions) {
				// Make dropdown interactable
				gsap.set(dropdownRef.current, { pointerEvents: "auto" });

				// Dropdown entrance animation
				gsap.fromTo(
					dropdownRef.current,
					{
						y: -15,
						opacity: 0,
						scale: 0.95,
					},
					{
						y: 0,
						opacity: 1,
						scale: 1,
						duration: 0.3,
						ease: "power2.out",
					},
				);

				// Animate dropdown content
				gsap.fromTo(
					dropdownRef.current?.querySelectorAll("div > div") || [],
					{
						x: -10,
						opacity: 0,
					},
					{
						x: 0,
						opacity: 1,
						duration: 0.25,
						stagger: 0.05,
						delay: 0.1,
						ease: "power2.out",
					},
				);

				// Animate chevron
				if (solutionButtonRef.current) {
					gsap.to(solutionButtonRef.current.querySelector("svg"), {
						rotate: 180,
						duration: 0.3,
						ease: "power2.inOut",
					});
				}
			} else {
				// Dropdown exit animation
				gsap.to(dropdownRef.current, {
					y: -10,
					opacity: 0,
					scale: 0.98,
					duration: 0.2,
					ease: "power2.in",
					onComplete: () => {
						// Only disable pointer events after animation completes
						gsap.set(dropdownRef.current, { pointerEvents: "none" });
					},
				});

				// Reset chevron
				if (solutionButtonRef.current) {
					gsap.to(solutionButtonRef.current.querySelector("svg"), {
						rotate: 0,
						duration: 0.25,
						ease: "power2.inOut",
					});
				}
			}
		});

		return () => ctx.revert();
	}, [showSolutions]);

	// Hover animation for nav items
	const handleNavHover = (index: number, isHovering: boolean) => {
		const navItem = navItemsRef.current[index];
		if (!navItem) return;

		gsap.to(navItem, {
			color: isHovering ? "#E6B101" : "#000000",
			duration: 0.2,
			ease: "power2.out",
		});
	};

	// Hover animation for buttons
	const handleButtonHover = (element: HTMLElement, isHovering: boolean) => {
		gsap.to(element, {
			scale: isHovering ? 1.05 : 1,
			duration: 0.2,
			ease: "power2.out",
		});
	};

	// Hover handlers for solution dropdown with delay
	const handleMouseEnter = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setShowSolutions(true);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setShowSolutions(false);
		}, 250); // 250ms delay — enough time to move mouse to dropdown
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
		document.body.style.overflow = isMobileMenuOpen ? "unset" : "hidden";
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
		document.body.style.overflow = "unset";
	};

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handleTraderClick = (e: React.MouseEvent) => {
		e.preventDefault();
		if (!user) {
			router.push("/trader");
		} else if ((user as any).business_type === "trader") {
			router.push("/dashboard");
		} else {
			router.push("/trader");
		}
	};

	return (
		<header
			ref={headerRef}
			className='font-inter w-full bg-white z-50 fixed top-0 border-b bg-clip-padding'
			style={{
				borderImage:
					"linear-gradient(to right, transparent, rgb(3, 40, 28), transparent) 1",
			}}
		>
			<div className='max-w-[1360px] mx-auto pl-2 pr-4 lg:px-4 xl:px-2 py-5 grid grid-cols-10 items-center'>
				{/* Logo */}
				<div
					ref={logoRef}
					className='col-span-8 lg:col-span-2 xl:col-span-3 flex gap-x-2 lg:gap-x-3 items-center'
				>
					<RummerLogo isGreen />
					<div className='hidden xl:block'>
						<CountrySelector2 />
					</div>
				</div>

				{/* Desktop Navigation */}
				<nav className='hidden lg:flex justify-center items-center col-span-4 gap-12 font-extralight text-black-100'>
					{NAV_ITEMS?.map((item, index) => (
						<div
							key={item.label}
							ref={(el) => {
								if (el) navItemsRef.current[index] = el;
							}}
							className='relative group/tooltip'
						>
							{item.label === "Solutions" ? (
								<button
									onClick={() => scrollToSection("solutions")}
									className={`flex items-center gap-1 ${
										pathname === item.href ? "text-primary-200" : ""
									}`}
									onMouseEnter={() => handleNavHover(index, true)}
									onMouseLeave={() => handleNavHover(index, false)}
								>
									{item.label}
									{/* <ChevronDown className='w-4 h-4' /> */}
								</button>
							) : item.label === "About" ? (
								<Link
									href="/about"
									className={`flex items-center gap-1 hover:text-[#E6B101] transition-colors duration-200 ${
										pathname === "/about" ? "text-primary-200" : ""
									}`}
								>
									{item.label}
								</Link>
							) : item.label === "Visit Rumer Market" ? (
								<Link
									href="/marketplace"
									className={`relative ${
										pathname === "/marketplace" ? "text-primary-200" : ""
									} whitespace-nowrap`}
									onMouseEnter={() => handleNavHover(index, true)}
									onMouseLeave={() => handleNavHover(index, false)}
								>
									{item.label}
								</Link>
							) : item.label === "Products" ? (
								<div
									className='relative group/products'
									onMouseEnter={() => handleNavHover(index, true)}
									onMouseLeave={() => handleNavHover(index, false)}
								>
									<button
										className={`flex items-center gap-1 ${
											pathname === "/marketplace" ? "text-primary-200" : ""
										}`}
									>
										{item.label}
										<ChevronDown className='w-4 h-4 transition-transform duration-200 group-hover/products:rotate-180' />
									</button>
									<div className='absolute top-full left-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover/products:opacity-100 group-hover/products:visible transition-all duration-200 py-2 z-50'>
										{item.submenu?.map((sub) =>
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
											) : sub.label === "Rumer Trader" ? (
												<button
													key={sub.label}
													onClick={handleTraderClick}
													className='flex items-center justify-between w-full px-4 py-2.5 text-sm text-black-100 hover:text-primary-400 hover:bg-gray-50 transition-colors text-left'
												>
													<span>{sub.label}</span>
												</button>
											) : (
												<Link
													key={sub.label}
													href={sub.href}
													className='flex items-center justify-between px-4 py-2.5 text-sm text-black-100 hover:text-primary-400 hover:bg-gray-50 transition-colors'
												>
													<span>{sub.label}</span>
												</Link>
											)
											)}
									</div>
									</div>
								) : (
								<a
									href={item.href}
									className={`relative ${
										pathname === item.href ? "text-primary-200" : ""
									} after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-secondary-100 after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap`}
									onMouseEnter={() => handleNavHover(index, true)}
									onMouseLeave={() => handleNavHover(index, false)}
								>
									{item.label}
								</a>
							)}
						</div>
					))}
				</nav>

				{/* Desktop Buttons */}
				<div
					ref={buttonsRef}
					className='hidden lg:flex col-span-4 xl:col-span-3 items-center justify-end gap-3'
				>
					{isLoggedIn ? (
						<div className='relative'>
							<button
								onClick={() => setUserMenuOpen(!userMenuOpen)}
								className='flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 border-2 border-gray-300 transition-colors'
							>
								{user?.profile_picture ? (
									<img src={user.profile_picture} alt={userName || "User"} className='w-8 h-8 rounded-full object-cover' />
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

							{userMenuOpen && (
								<>
									<div className='fixed inset-0 z-40' onClick={() => setUserMenuOpen(false)} />
									<div className='absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden py-1'>
										<button
											onClick={() => {
												setUserMenuOpen(false);
												router.push("/dashboard");
											}}
											className='w-full px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3'
										>
											Dashboard
										</button>
										<div className='border-t border-gray-100' />
										<button
											onClick={() => {
												setUserMenuOpen(false);
												signOut();
											}}
											className='w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3'
										>
											Sign Out
										</button>
									</div>
								</>
							)}
						</div>
					) : (
						<>
							<Link
								href='/login'
								className='border-black-100 border whitespace-nowrap text-sm font-light text-black-100 hover:bg-black-100 hover:text-white px-2 lg:px-5 py-3 rounded-lg shadow transition-[.3] flex items-center xl:!text-sm'
								onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
								onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
							>
								<span className='whitespace-nowrap'>Sign In</span>
							</Link>
							<div
								className='relative group/btn-tooltip'
								onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
								onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
							>
								<Link
									href="/signup"
									className='bg-black-100 font-inter w-fit text-white space-x-2 text-sm sm:text-base group font-light px-2 lg:px-5 py-3 rounded-lg shadow hover:bg-black-100/80 transition-[.3] flex items-center xl:!text-sm'
								>
									<span className='whitespace-nowrap'>Sign Up</span>
								</Link>
							</div>
						</>
					)}
				</div>

				{/* Mobile Hamburger */}
				<div className='col-span-2 flex lg:hidden items-center justify-end'>
					<button
						onClick={toggleMobileMenu}
						className='p-2 text-black-100 hover:text-primary-400 transition-colors'
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

			<MobileNavB
				isOpen={isMobileMenuOpen}
				onClose={closeMobileMenu}
				navItems={NAV_ITEMS}
				showMarketplaceButton={false}
			/>
		</header>
	);
};

export default HeaderB;
