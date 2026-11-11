"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Check, Trash2, AlertTriangle, AlertCircle, Info, CheckCircle, ArrowLeft } from "lucide-react";
import { useNotifications } from "@/components/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { type NotificationType } from "@/components/lib/notifications";
import DashboardLayout from "../dashboard/DashboardLayout";

const typeIcons: Record<NotificationType, React.ElementType> = {
	info: Info,
	success: CheckCircle,
	warning: AlertTriangle,
	error: AlertCircle,
};

const typeColors: Record<NotificationType, string> = {
	info: "bg-blue-100 text-blue-600",
	success: "bg-green-100 text-green-600",
	warning: "bg-yellow-100 text-yellow-600",
	error: "bg-red-100 text-red-600",
};

type FilterType = "all" | "unread" | "read";

export default function NotificationsPage() {
	const {
		notifications,
		unreadCount,
		mounted,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		clearNotifications,
	} = useNotifications();
	const [filter, setFilter] = useState<FilterType>("all");
	const router = useRouter();
	const [backHref, setBackHref] = useState<string>("/dashboard");

	// Context-aware back link: return the user to where they came from.
	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			const referrer = document.referrer || "";
			if (referrer.includes("/marketplace")) {
				setBackHref("/marketplace/account");
			} else {
				setBackHref("/dashboard");
			}
		} catch {
			setBackHref("/dashboard");
		}
	}, []);

	if (!mounted) return null;

	const filtered = notifications.filter((n) => {
		if (filter === "unread") return !n.read;
		if (filter === "read") return n.read;
		return true;
	});

	return (
		<DashboardLayout className='px-4'>
			<div className='max-w-4xl mx-auto px-2 sm:px-4 py-4'>
				{/* Header */}
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
					<div className='flex items-center gap-3'>
						<button
							onClick={() => {
								if (window.history.length > 1) {
									router.back();
								} else {
									router.push(backHref);
								}
							}}
							aria-label='Go back'
							className='p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors'
						>
							<ArrowLeft className='w-5 h-5' />
						</button>
						<div>
							<h1 className='text-2xl font-bold text-gray-900'>Notifications</h1>
							<p className='text-sm text-gray-500'>
								{unreadCount > 0
									? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
									: "You're all caught up"}
							</p>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						{unreadCount > 0 && (
							<button
								onClick={markAllAsRead}
								className='flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#014834] bg-green-50 hover:bg-green-100 rounded-lg transition-colors'
							>
								<Check className='w-4 h-4' />
								Mark all read
							</button>
						)}
						{notifications.length > 0 && (
							<button
								onClick={clearNotifications}
								className='flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors'
							>
								<Trash2 className='w-4 h-4' />
								Clear all
							</button>
						)}
					</div>
				</div>

				{/* Filters */}
				<div className='flex items-center gap-2 mb-6 overflow-x-auto pb-2'>
					{(["all", "unread", "read"] as FilterType[]).map((f) => (
						<button
							key={f}
							onClick={() => setFilter(f)}
							className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap ${
								filter === f
									? "bg-[#014834] text-white"
									: "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
							}`}
						>
							{f}
							{f === "unread" && unreadCount > 0 && (
								<span className='ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full'>
									{unreadCount}
								</span>
							)}
						</button>
					))}
				</div>

				{/* List */}
				<div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
					{filtered.length === 0 ? (
						<div className='px-6 py-16 text-center'>
							<Bell className='w-12 h-12 text-gray-300 mx-auto mb-3' />
							<h3 className='text-lg font-medium text-gray-900 mb-1'>
								{filter === "all" ? "No notifications" : `No ${filter} notifications`}
							</h3>
							<p className='text-sm text-gray-500'>
								{filter === "all"
									? "You'll see your notifications here."
									: "Check another filter to see notifications."}
							</p>
						</div>
					) : (
						<div className='divide-y divide-gray-100'>
							{filtered.map((notification) => {
								const Icon = typeIcons[notification.type];
								return (
									<div
										key={notification.id}
										className={`flex gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${
											!notification.read ? "bg-blue-50/30" : ""
										}`}
									>
										<div
											className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
												typeColors[notification.type]
											}`}
										>
											<Icon className='w-5 h-5' />
										</div>

										<div className='flex-1 min-w-0'>
											<div className='flex items-start justify-between gap-4'>
												<div>
													{notification.link ? (
														<Link
															href={notification.link}
															onClick={() => markAsRead(notification.id)}
															className='block'
														>
															<h3 className='text-base font-medium text-gray-900 hover:text-[#014834]'>
																{notification.title}
															</h3>
														</Link>
													) : (
														<h3 className='text-base font-medium text-gray-900'>
															{notification.title}
														</h3>
													)}
													<p className='text-sm text-gray-600 mt-1'>
														{notification.message}
													</p>
													<p className='text-xs text-gray-400 mt-2'>
														{formatDistanceToNow(new Date(notification.createdAt), {
															addSuffix: true,
														})}
													</p>
												</div>

												<div className='flex items-center gap-1 flex-shrink-0'>
													{!notification.read && (
														<button
															onClick={() => markAsRead(notification.id)}
															className='p-2 text-gray-400 hover:text-[#014834] hover:bg-green-50 rounded-lg transition-colors'
															aria-label='Mark as read'
														>
															<Check className='w-4 h-4' />
														</button>
													)}
													<button
															onClick={() => deleteNotification(notification.id)}
															className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors'
															aria-label='Delete notification'
														>
															<Trash2 className='w-4 h-4' />
														</button>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</DashboardLayout>
	);
}
