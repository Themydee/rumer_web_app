// components/layout/DashboardSideNav.tsx
"use client";
import styles from "../../css/Scrollbar.module.css";
import { VscChevronDown, VscChevronRight } from "react-icons/vsc";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
	Home,
	Package,
	Wallet,
	ShieldCheck,
	Users,
	ShoppingBag,
	Settings,
	HelpCircle,
	Share2,
	ChevronUp,
	Plus,
	BarChart3,
	LogOut,
} from "lucide-react";
import { RummerLogo } from "@/components/utils/functions";
import {
	ArchiveIcon,
	BagIcon,
	BuildingIcon,
	HomeFilledIcon,
	ShieldIcon,
} from "@/components/utils/SVGIcons";
import { useAppSelector, useAppDispatch } from "@/components/hooks";
import { authLogout } from "@/components/set-up/redux/children/auth";
import { getKycTier } from "@/components/lib/user";

// === Constants ===
const NAV_ITEMS_BASE = [
	{ label: "Orders", icon: BagIcon, href: "/dashboard/orders" },
];

export const PRODUCTS_SUBMENU = [
	{ label: "Add New Stock", href: "/dashboard/products/add", icon: Package },
	{ label: "Manage Stock", href: "/dashboard/products/manage", icon: Package },
	{ label: "Drafts", href: "/dashboard/products/drafts", icon: Package },
	{ label: "Pending Approval", href: "/dashboard/products/pending", icon: Package },
	{ label: "Published", href: "/dashboard/products/published", icon: Package },
	{ label: "Sold", href: "/dashboard/products/sold", icon: Package },
];

const TRADERS_SUBMENU = [
	{ label: "Active Negotiations", href: "/my-traders/active" },
	{ label: "Order History", href: "/my-traders/orders" },
];

const BOTTOM_ITEMS = [
	{ label: "Settings", icon: Settings, href: "/dashboard/settings" },
	{ label: "Help Center", icon: HelpCircle, href: "/help" },
	{ label: "Refer family & friends", icon: Share2, href: "/refer" },
];

interface SubmenuNavProps {
	label: string;
	icon: any;
	href: string;
	submenu: { label: string; href: string; icon?: any }[];
	isActive: boolean;
	isExpanded: boolean;
	onToggle: () => void;
}

const SubmenuNav = ({
	label,
	icon: Icon,
	href,
	submenu,
	isActive,
	isExpanded,
	onToggle,
}: SubmenuNavProps) => {
	const router = useRouter();

	return (
		<div>
			<div
				onClick={onToggle}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						onToggle();
					}
				}}
				className={`group relative flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all ${
					isActive
						? "bg-primary-200/10 text-black-100/80 font-extralight shadow-sm"
						: "text-gray-600 hover:bg-primary-200/10"
				}`}
			>
				<div className="flex items-center gap-3">
					<Icon
						className={`w-5 h-5 transition-transform group-hover:scale-110 ${
							isActive ? "text-primary-100" : "text-gray-500"
						}`}
					/>
					<span className="text-sm">{label}</span>
				</div>
				<div className="transition-transform duration-200">
					{isExpanded ? (
						<VscChevronDown className="text-2xl text-gray-900/60" />
					) : (
						<VscChevronRight className="text-2xl text-gray-900/60" />
					)}
				</div>
			</div>
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden"
					>
						<div className="ml-4 mt-1 space-y-0.5">
							{submenu.map((item) => (
								<div
									key={item.label}
									onClick={() => router.push(item.href)}
									role="button"
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											router.push(item.href);
										}
									}}
									className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer text-sm text-gray-600 hover:bg-primary-200/10 hover:text-gray-900 transition"
								>
									{item.icon && <item.icon className="w-4 h-4" />}
									{!item.icon && <span className="w-1 h-1 bg-gray-400 rounded-full" />}
									<span>{item.label}</span>
								</div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const RumerFarmerLogoSetup = () => (
	<div className='flex items-center gap-x-2'>
		<RummerLogo isGreen className='!w-[90px] lg:!w-[110px] xl:w-[120px]' />
		<h4 className='text-black-100 text-xl mt-2 font-medium'>Trader</h4>
	</div>
);

const NavItem = ({ item, isActive, onHoverStart, onHoverEnd }: any) => {
	const Icon = item.icon;
	const router = useRouter();

	const handleClick = () => {
		if (item.href) router.push(item.href);
	};

	return (
		<motion.div
			whileHover={{ x: 6 }}
			onHoverStart={() => onHoverStart?.()}
			onHoverEnd={() => onHoverEnd?.()}
			onClick={handleClick}
			role='button'
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handleClick();
				}
			}}
			className={`group relative flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all
        ${
					isActive
						? "bg-primary-200/10 text-black-100/80 font-extralight shadow-sm"
						: "text-gray-600 hover:bg-primary-200/10"
				}`}
		>
			<div className='flex items-center gap-3'>
				<Icon
					className={`w-5 h-5 transition-transform group-hover:scale-110 ${
						isActive ? "text-primary-100" : "text-gray-500"
					}`}
				/>
				<span className='text-sm'>{item.label}</span>
			</div>
			{item.badge && (
				<span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
					item.badge === "Verified"
						? "bg-green-100 text-green-700"
						: "bg-gray_1-100 text-gray-950/60"
				}`}>
					{item.badge}
				</span>
			)}

			{item.hasSubmenu && (
				<VscChevronDown className='text-2xl text-gray-900/60 group-hover:text-gray-600' />
			)}
		</motion.div>
	);
};

const DashboardSideNav = () => {
	const pathname = usePathname();
	const navRef = useRef<HTMLDivElement>(null);
	const { user } = useAppSelector((state) => state.auth);
	const [expandedSections, setExpandedSections] = useState<string[]>(["Products"]);

	const currentTier = getKycTier(user);
	const isBusiness = (user as any)?.business_type === "business";

	let kycHref = "/kyc";
	let kycBadge = "Tier 0 (Basic)";

	if (currentTier === "tier_3") {
		kycHref = "/business-verification";
		kycBadge = "Tier 3 (Business)";
	} else if (currentTier === "tier_2") {
		kycHref = "/cooperative-verification";
		kycBadge = "Tier 2 (Coop)";
	} else if (currentTier === "tier_1") {
		kycHref = isBusiness ? "/business-verification" : "/cooperative-verification";
		kycBadge = "Tier 1 (Verified)";
	} else {
		kycHref = isBusiness ? "/business-verification" : "/kyc";
		kycBadge = "Tier 0 (Basic)";
	}

	const dispatch = useAppDispatch();

	const handleLogout = () => {
		dispatch(authLogout());
		if (typeof window !== "undefined") {
			localStorage.removeItem("rumer_auth_token");
		}
		window.location.href = "/login";
	};

	const NAV_ITEMS = [
		{ label: "Wallet", icon: Wallet, href: "/dashboard/wallet" },
		{ label: "KYC Tier", icon: ShieldIcon, href: kycHref, badge: kycBadge },
		...NAV_ITEMS_BASE,
	];

	useEffect(() => {
		if (!navRef.current) return;

		gsap.fromTo(
			navRef.current,
			{ x: -100, opacity: 0 },
			{ x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
		);

		gsap.fromTo(
			".nav-item",
			{ x: -30, opacity: 0 },
			{
				x: 0,
				opacity: 1,
				duration: 0.6,
				stagger: 0.08,
				delay: 0.3,
				ease: "power2.out",
			},
		);
	}, []);

	const userName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
	const initials = userName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const toggleSection = (section: string) => {
		setExpandedSections((prev) =>
			prev.includes(section)
				? prev.filter((s) => s !== section)
				: [...prev, section]
		);
	};

	return (
		<aside
			ref={navRef}
			className={`hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 shadow-md sticky top-0 h-full`}
		>
			{/* Logo & Header */}
			<div className='p-6 border-b border-gray-100/50'>
				<RumerFarmerLogoSetup />
			</div>

			<div
				className={`flex-1 overflow-y-auto px-4 py-6 space-y-8 ${styles["inner-sidebar-scroll"]}`}
			>
				{/* Main Navigation */}
				<nav className='space-y-1'>
					{/* Home */}
					<div className='nav-item'>
						<NavItem
							item={{ label: "Home", icon: HomeFilledIcon, href: "/dashboard" }}
							isActive={pathname === "/dashboard"}
						/>
					</div>

					{/* Products with Submenu (where Listings was) */}
					<div className='nav-item'>
						<SubmenuNav
							label="Manage Products"
							icon={ArchiveIcon}
							href="/dashboard/products"
							submenu={PRODUCTS_SUBMENU}
							isActive={pathname.startsWith("/dashboard/products")}
							isExpanded={expandedSections.includes("Products")}
							onToggle={() => toggleSection("Products")}
						/>
					</div>

					{/* Remaining main nav items */}
					{NAV_ITEMS.map((item) => (
						<div key={item.label} className='nav-item'>
							<NavItem item={item} isActive={pathname === item.href} />
						</div>
					))}
				</nav>

					{/* Bottom Navigation */}
					<nav className='space-y-1 pt-8 border-t border-gray-100'>
					{BOTTOM_ITEMS.map((item) => (
						<div key={item.label} className='nav-item'>
							<NavItem item={item} isActive={pathname === item.href} />
						</div>
					))}
				</nav>
			</div>

			{/* User Profile */}
			<div className='p-4 border-t border-gray-200'>
				<div className='flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer'>
					<div className='relative'>
						{user?.profile_picture ? (
							<img
								src={user.profile_picture}
								alt={userName || "User"}
								className='w-10 h-10 rounded-full object-cover'
							/>
						) : (
							<div className='w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg'>
								{initials || "G"}
							</div>
						)}
						<div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></div>
					</div>
					<div className='flex-1 min-w-0'>
						<p className='font-medium text-gray-900 truncate'>
							{userName || "User"}
						</p>
						<p className='text-xs text-gray-500 truncate'>
							{user?.email || "user@example.com"}
						</p>
					</div>
					<div className='flex items-center gap-2'>
						<button
							onClick={handleLogout}
							className='p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors'
							title="Logout"
							aria-label="Logout"
						>
							<LogOut className='w-5 h-5' />
						</button>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default DashboardSideNav;
