"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Clock, CheckCircle, ShoppingCart } from "lucide-react";
import { Loader2 } from "lucide-react";
import { getToken } from "@/components/lib/supabase/auth";

interface Stats {
	pending: number;
	published: number;
	draft: number;
	sold: number;
}

export default function AdminDashboardPage() {
	const [stats, setStats] = useState<Stats>({ pending: 0, published: 0, draft: 0, sold: 0 });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchStats();
	}, []);

	const fetchStats = async () => {
		try {
			const token = getToken();
			const headers = { Authorization: `Bearer ${token}` };
			const [pendingRes, publishedRes, draftRes, soldRes] = await Promise.all([
				fetch("/api/admin/products?status=pending", { headers }),
				fetch("/api/admin/products?status=published", { headers }),
				fetch("/api/admin/products?status=draft", { headers }),
				fetch("/api/admin/products?status=sold", { headers }),
			]);

			const [pending, published, draft, sold] = await Promise.all([
				pendingRes.json(),
				publishedRes.json(),
				draftRes.json(),
				soldRes.json(),
			]);

			setStats({
				pending: pending.products?.length || 0,
				published: published.products?.length || 0,
				draft: draft.products?.length || 0,
				sold: sold.products?.length || 0,
			});
		} catch (error) {
			console.error("Failed to fetch stats:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="w-8 h-8 animate-spin text-[#014834]" />
			</div>
		);
	}

	const cards = [
		{
			label: "Pending Approval",
			value: stats.pending,
			icon: Clock,
			color: "bg-yellow-100 text-yellow-600",
			href: "/admin/products/pending",
		},
		{
			label: "Published",
			value: stats.published,
			icon: CheckCircle,
			color: "bg-green-100 text-green-600",
			href: "/admin/products/published",
		},
		{
			label: "Drafts",
			value: stats.draft,
			icon: Package,
			color: "bg-gray-100 text-gray-600",
			href: "/admin/products?status=draft",
		},
		{
			label: "Sold",
			value: stats.sold,
			icon: ShoppingCart,
			color: "bg-blue-100 text-blue-600",
			href: "/admin/products?status=sold",
		},
	];

	return (
		<div>
			<div className="mb-8">
				<h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
				<p className="text-gray-500 mt-1">Manage marketplace products</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{cards.map((card) => (
					<Link
						key={card.label}
						href={card.href}
						className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500">{card.label}</p>
								<p className="text-3xl font-bold text-gray-900 mt-2">
									{card.value}
								</p>
							</div>
							<div
								className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}
							>
								<card.icon className="w-6 h-6" />
							</div>
						</div>
					</Link>
				))}
			</div>

			{stats.pending > 0 && (
				<div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
					<div className="flex items-center gap-3">
						<Clock className="w-6 h-6 text-yellow-600" />
						<div>
							<h3 className="font-semibold text-gray-900">
								{stats.pending} product{stats.pending !== 1 ? "s" : ""} waiting
								for approval
							</h3>
							<p className="text-sm text-gray-600 mt-1">
								Products submitted by traders need your review before they appear
								on the marketplace.
							</p>
						</div>
						<Link
							href="/admin/products/pending"
							className="ml-auto px-4 py-2 bg-[#014834] text-white rounded-lg hover:bg-[#013824] transition"
						>
							Review Now
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
