"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RummerLogo } from "@/components/utils/functions";
import AuthBootstrap from "@/components/AuthBootstrap";
import { useAppSelector } from "@/components/hooks";
import { getToken } from "@/components/lib/supabase/auth";
import { Loader2, ShieldAlert, Menu, X } from "lucide-react";

interface AdminLayoutProps {
	children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
	const router = useRouter();
	const { user } = useAppSelector((state) => state.auth);
	const [loading, setLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	useEffect(() => {
		const checkAdmin = async () => {
			const token = getToken();
			if (!token) {
				router.push("/login");
				return;
			}

			try {
				const res = await fetch("/api/auth/me", {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!res.ok) {
					router.push("/login");
					return;
				}
				const data = await res.json();
				const adminStatus = data.user?.profile?.is_admin === true;
				setIsAdmin(adminStatus);
				if (!adminStatus) {
					router.push("/dashboard");
				}
			} catch {
				router.push("/dashboard");
			} finally {
				setLoading(false);
			}
		};

		checkAdmin();
	}, [router]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="w-8 h-8 animate-spin text-[#014834]" />
			</div>
		);
	}

	if (!isAdmin) {
		return null;
	}

	return (
		<main className="flex relative min-h-screen bg-gray-50">
			<AuthBootstrap />

			{/* Mobile sidebar overlay */}
			{mobileNavOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={() => setMobileNavOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside className={`${mobileNavOpen ? "fixed inset-y-0 left-0 z-50 flex" : "hidden lg:flex"} flex-col w-64 bg-white border-r border-gray-200 shadow-md`}>
				<div className="flex items-center justify-between p-6 border-b border-gray-100/50">
					<Link href="/admin" className="flex items-center gap-x-2" onClick={() => setMobileNavOpen(false)}>
						<RummerLogo isGreen className="!w-[90px] lg:!w-[110px]" />
						<h4 className="text-black-100 text-xl mt-2 font-medium">Admin</h4>
					</Link>
					<button
						onClick={() => setMobileNavOpen(false)}
						className="p-1 hover:bg-gray-100 rounded-lg lg:hidden"
						aria-label="Close menu"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
					<Link
						href="/admin"
						onClick={() => setMobileNavOpen(false)}
						className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-primary-200/10 hover:text-gray-900 transition"
					>
						<span className="w-2 h-2 bg-gray-400 rounded-full" />
						Dashboard
					</Link>
					<Link
						href="/admin/products/pending"
						onClick={() => setMobileNavOpen(false)}
						className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-primary-200/10 hover:text-gray-900 transition"
					>
						<span className="w-2 h-2 bg-yellow-500 rounded-full" />
						Pending Approval
					</Link>
					<Link
						href="/admin/products/published"
						onClick={() => setMobileNavOpen(false)}
						className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-primary-200/10 hover:text-gray-900 transition"
					>
						<span className="w-2 h-2 bg-green-500 rounded-full" />
						Published
					</Link>
					<Link
						href="/marketplace"
						className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-primary-200/10 hover:text-gray-900 transition"
					>
						<span className="w-2 h-2 bg-blue-500 rounded-full" />
						View Marketplace
					</Link>
				</nav>
			</aside>

			{/* Main content */}
			<div className="flex-1 overflow-y-auto">
				<header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
					<div className="flex items-center gap-3">
						<button
							onClick={() => setMobileNavOpen(true)}
							className="p-1.5 hover:bg-gray-100 rounded-lg lg:hidden"
							aria-label="Open menu"
						>
							<Menu className="w-5 h-5" />
						</button>
						<h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
					</div>
				</header>
				<div className="p-4 sm:p-6">{children}</div>
			</div>
		</main>
	);
};

export default AdminLayout;
