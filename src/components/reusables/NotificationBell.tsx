"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
	Bell,
	Check,
	Trash2,
	X,
	Info,
	CheckCircle,
	AlertTriangle,
	AlertCircle,
} from "lucide-react";
import { useNotifications } from "@/components/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

interface NotificationBellProps {
	variant?: "dark" | "light";
}

const typeIcons = {
	info: Info,
	success: CheckCircle,
	warning: AlertTriangle,
	error: AlertCircle,
};

const typeColors = {
	info: "bg-blue-100 text-blue-600",
	success: "bg-green-100 text-green-600",
	warning: "bg-yellow-100 text-yellow-600",
	error: "bg-red-100 text-red-600",
};

export default function NotificationBell({ variant = "light" }: NotificationBellProps) {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { notifications, unreadCount, mounted, markAsRead, markAllAsRead, deleteNotification } =
		useNotifications();

	const [toast, setToast] = useState<
		{ id: string; title: string; message: string } | null
	>(null);
	const seenIdsRef = useRef<Set<string>>(new Set());
	const initializedRef = useRef(false);
	const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Detect newly-appearing notifications and flash a toast (skip the first
	// render so we don't toast pre-existing unread items on page load).
	useEffect(() => {
		if (!mounted) return;

		if (!initializedRef.current) {
			initializedRef.current = true;
			notifications.forEach((n) => seenIdsRef.current.add(n.id));
			return;
		}

		const fresh = notifications.find(
			(n) => !n.read && !seenIdsRef.current.has(n.id)
		);
		if (fresh) {
			seenIdsRef.current.add(fresh.id);
			if (!open) {
				setToast({ id: fresh.id, title: fresh.title, message: fresh.message });
				if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
				toastTimerRef.current = setTimeout(() => setToast(null), 5000);
			}
		}
		notifications.forEach((n) => seenIdsRef.current.add(n.id));
	}, [notifications, mounted, open]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
			if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
		};
	}, []);

	if (!mounted) {
		return (
			<button
				className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
					variant === "dark"
						? "text-white hover:text-white/80"
						: "text-gray-900 hover:text-[#014834]"
				}`}
				aria-label='Notifications'
			>
				<Bell className='w-5 h-5 sm:w-6 sm:h-6' />
			</button>
		);
	}

	const recentNotifications = notifications.slice(0, 5);

	const ToastIcon =
		typeIcons[toast ? notifications.find((n) => n.id === toast.id)?.type || "info" : "info"];
	const ToastColor =
		typeColors[
			toast ? notifications.find((n) => n.id === toast.id)?.type || "info" : "info"
		];

	return (
		<>
			<div className='relative' ref={dropdownRef}>
			<button
				onClick={() => setOpen(!open)}
				aria-expanded={open}
				aria-haspopup='true'
				aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
				className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
					variant === "dark"
						? "text-white hover:text-white/80"
						: "text-gray-900 hover:text-[#014834]"
				}`}
			>
				<Bell className='w-5 h-5 sm:w-6 sm:h-6' />
					{unreadCount > 0 && (
						<span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white'>
							{unreadCount > 9 ? "9+" : unreadCount}
						</span>
					)}
				</button>

				{open && (
					<div className='absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden'>
						<div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
							<h3 className='font-semibold text-gray-900'>Notifications</h3>
							<div className='flex items-center gap-2'>
								{unreadCount > 0 && (
									<button
										onClick={markAllAsRead}
										className='text-xs text-[#014834] hover:text-[#013628] font-medium flex items-center gap-1'
									>
										<Check className='w-3 h-3' />
										Mark all read
									</button>
								)}
								<button
									onClick={() => setOpen(false)}
									aria-label='Close notifications'
									className='text-gray-400 hover:text-gray-600'
								>
									<X className='w-4 h-4' />
								</button>
							</div>
						</div>

						<div className='max-h-[400px] overflow-y-auto'>
							{recentNotifications.length === 0 ? (
								<div className='px-4 py-8 text-center text-gray-500'>
									<Bell className='w-10 h-10 mx-auto mb-2 text-gray-300' />
									<p className='text-sm'>No notifications yet</p>
								</div>
							) : (
								recentNotifications.map((notification) => {
									const Icon = typeIcons[notification.type];
									return (
										<div
											key={notification.id}
											className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 ${
												!notification.read ? "bg-blue-50/30" : ""
											}`}
										>
											<div
												className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
													typeColors[notification.type]
												}`}
											>
												<Icon className='w-4 h-4' />
											</div>
											<div className='flex-1 min-w-0'>
												{notification.link ? (
													<Link
														href={notification.link}
														onClick={() => {
															markAsRead(notification.id);
															setOpen(false);
														}}
														className='block'
													>
														<p className='text-sm font-medium text-gray-900 leading-tight'>
															{notification.title}
														</p>
														<p className='text-xs text-gray-600 mt-0.5 line-clamp-2'>
															{notification.message}
														</p>
													</Link>
												) : (
													<>
														<p className='text-sm font-medium text-gray-900 leading-tight'>
															{notification.title}
														</p>
														<p className='text-xs text-gray-600 mt-0.5 line-clamp-2'>
															{notification.message}
														</p>
													</>
												)}
												<p className='text-xs text-gray-400 mt-1'>
													{formatDistanceToNow(
														new Date(notification.createdAt),
														{ addSuffix: true }
													)}
												</p>
											</div>
											<div className='flex flex-col gap-1'>
												{!notification.read && (
													<button
														onClick={() => markAsRead(notification.id)}
														className='p-1.5 text-gray-400 hover:text-[#014834] hover:bg-green-50 rounded-lg transition-colors'
														aria-label='Mark as read'
													>
														<Check className='w-3.5 h-3.5' />
													</button>
												)}
												<button
													onClick={() => deleteNotification(notification.id)}
													className='p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors'
													aria-label='Delete notification'
												>
													<Trash2 className='w-3.5 h-3.5' />
												</button>
											</div>
										</div>
									);
								})
							)}
						</div>

						<div className='px-4 py-2 border-t border-gray-100 bg-gray-50'>
							<Link
								href='/notifications'
								onClick={() => setOpen(false)}
								className='block text-center text-sm text-[#014834] hover:text-[#013628] font-medium'
							>
								View all notifications
							</Link>
						</div>
					</div>
				)}
			</div>

			{/* Toast */}
			<AnimatePresence>
				{toast && (
					<motion.div
						initial={{ opacity: 0, y: -16, scale: 0.97 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -16, scale: 0.97 }}
						transition={{ duration: 0.2 }}
						className='fixed top-4 right-4 z-[100] max-w-sm w-[calc(100%-2rem)]'
						role='status'
						aria-live='polite'
					>
						<div className='flex items-start gap-3 bg-white rounded-xl shadow-2xl border border-gray-200 p-4'>
							<div
								className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${ToastColor}`}
							>
								<ToastIcon className='w-4 h-4' />
							</div>
							<div className='flex-1 min-w-0'>
								<p className='text-sm font-semibold text-gray-900 leading-tight'>
									{toast.title}
								</p>
								<p className='text-xs text-gray-600 mt-0.5 line-clamp-2'>
									{toast.message}
								</p>
							</div>
							<button
								onClick={() => setToast(null)}
								aria-label='Dismiss'
								className='text-gray-400 hover:text-gray-600 flex-shrink-0'
							>
								<X className='w-4 h-4' />
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}