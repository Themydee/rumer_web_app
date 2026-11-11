"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
	getNotifications,
	addNotification,
	markAsRead,
	markAllAsRead,
	deleteNotification,
	clearNotifications,
	getUnreadCount,
	areInAppNotificationsEnabled,
	getCurrentUserId,
	getNotificationSettings,
	saveNotificationSettings,
	saveNotifications,
	type Notification,
	type NotificationSettings,
} from "@/components/lib/notifications";
import {
	fetchRemoteNotifications,
	createRemoteNotification,
	markRemoteRead,
	deleteRemoteNotification,
	markAllRemoteRead,
	clearRemoteNotifications,
	fetchRemoteSettings,
	updateRemoteSettings,
} from "@/components/lib/notificationsServer";
import { supabase } from "@/components/lib/supabase/client";

// Module-level Realtime singleton. Supabase's `channel(topic)` returns an
// already-subscribed channel when one exists with the same topic, and
// `removeChannel()` is async, so re-creating a channel across React Strict
// Mode double-mounts or route changes throws "cannot add callbacks after
// subscribe()". Keeping a single shared channel avoids that entirely.
let realtimeChannelSingleton: ReturnType<typeof supabase.channel> | null = null;
let realtimeChannelSingletonUserId: string | null = null;
let latestRefresh: (() => void) | null = null;

export function useNotifications() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [mounted, setMounted] = useState(false);
	const [settings, setSettings] = useState<NotificationSettings>(() => ({
		in_app: true,
		push: true,
		email: false,
	}));
	const channelRef = useRef<BroadcastChannel | null>(null);

	const refresh = useCallback(() => {
		if (typeof window === "undefined") return;
		const list = getNotifications();
		setNotifications(list);
		setUnreadCount(getUnreadCount());
	}, []);

	// Load notification settings (localStorage cache + server if logged in)
	useEffect(() => {
		const local = getNotificationSettings();
		setSettings(local);
		const userId = getCurrentUserId();
		if (userId && userId !== "guest") {
			fetchRemoteSettings().then((remote) => {
				if (remote) {
					setSettings(remote);
					saveNotificationSettings(remote);
				}
			});
		}
	}, []);

	useEffect(() => {
		setMounted(true);
		refresh();
		latestRefresh = refresh;

		// If logged in, sync from the server once. Server is the source of truth;
		// seed the server with any local-only notifications first.
		const userId = getCurrentUserId();
		if (userId && userId !== "guest") {
			fetchRemoteNotifications().then((remote) => {
				if (!remote) return;
				if (remote.length > 0) {
					saveNotificationsMerged(remote);
				} else {
					const local = getNotifications();
					if (local.length > 0) {
						// Best-effort seed the server from local storage
						Promise.allSettled(
							local.map((n) =>
								createRemoteNotification({
									title: n.title,
									message: n.message,
									type: n.type,
									link: n.link,
									image: n.image,
								})
							)
						);
					}
				}
				refresh();
			});
		}

		const handleUpdate = () => refresh();
		window.addEventListener("rumer-notifications-updated", handleUpdate);
		window.addEventListener("storage", handleUpdate);

		// Cross-tab sync via BroadcastChannel
		try {
			const channel = new BroadcastChannel("rumer-notifications");
			channelRef.current = channel;
			channel.onmessage = (event) => {
				if (event.data?.type === "updated") {
					refresh();
				}
			};
		} catch {
			// BroadcastChannel not supported
		}

		// Realtime notifications from Supabase (module-level singleton)
		if (
			realtimeChannelSingleton &&
			realtimeChannelSingletonUserId !== userId
		) {
			supabase.removeChannel(realtimeChannelSingleton);
			realtimeChannelSingleton = null;
			realtimeChannelSingletonUserId = null;
		}

		if (userId && userId !== "guest" && !realtimeChannelSingleton) {
			const realtimeChannel = supabase.channel("rumer-notifications-realtime");
			realtimeChannelSingleton = realtimeChannel;
			realtimeChannelSingletonUserId = userId;

			// Live delivery: notifications are created server-side (in the API
			// routes that author product state changes / sales). We subscribe to
			// the user's own `notifications` table so new rows surface instantly.
			realtimeChannel
				.on(
					"postgres_changes",
					{
						event: "INSERT",
						schema: "public",
						table: "notifications",
						filter: `user_id=eq.${userId}`,
					},
					(payload) => {
						const row = payload.new as Record<string, unknown>;
						if (row && row.id) {
							receiveServerNotifications([row]);
						}
						latestRefresh?.();
					}
				)
				// Fallback for realtime on users' own products / inventory being
				// changed, in case Realtime for the notifications table isn't set
				// up yet.
				.on(
					"postgres_changes",
					{
						event: "UPDATE",
						schema: "public",
						table: "products",
						filter: `owner_id=eq.${userId}`,
					},
					() => {
						fetchFreshAndMerge();
					}
				)
				.on(
					"postgres_changes",
					{
						event: "UPDATE",
						schema: "public",
						table: "inventory",
						filter: `owner_id=eq.${userId}`,
					},
					() => {
						fetchFreshAndMerge();
					}
				)
				.on(
					"postgres_changes",
					{
						event: "INSERT",
						schema: "public",
						table: "transactions",
						filter: `buyer_id=eq.${userId}`,
					},
					() => {
						fetchFreshAndMerge();
					}
				)
				.on(
					"postgres_changes",
					{
						event: "INSERT",
						schema: "public",
						table: "transactions",
						filter: `seller_id=eq.${userId}`,
					},
					() => {
						fetchFreshAndMerge();
					}
				);

			realtimeChannel.subscribe();
		}

		return () => {
			window.removeEventListener("rumer-notifications-updated", handleUpdate);
			window.removeEventListener("storage", handleUpdate);
			channelRef.current?.close();
		};
	}, [refresh]);

	const notify = useCallback(
		(notification: Omit<Notification, "id" | "createdAt" | "read">) => {
			if (!areInAppNotificationsEnabled()) return;
			addNotification(notification);
			createRemoteNotification(notification);
			refresh();
		},
		[refresh]
	);

	const read = useCallback(
		(id: string) => {
			markAsRead(id);
			markRemoteRead(id);
			refresh();
		},
		[refresh]
	);

	const readAll = useCallback(() => {
		markAllAsRead();
		markAllRemoteRead();
		refresh();
	}, [refresh]);

	const remove = useCallback(
		(id: string) => {
			deleteNotification(id);
			deleteRemoteNotification(id);
			refresh();
		},
		[refresh]
	);

	const clear = useCallback(() => {
		clearNotifications();
		clearRemoteNotifications();
		refresh();
	}, [refresh]);

	const updateSettings = useCallback(
		(updates: Partial<NotificationSettings>) => {
			const next = { ...getNotificationSettings(), ...updates };
			saveNotificationSettings(next);
			setSettings(next);
			updateRemoteSettings(updates);
		},
		[]
	);

	return {
		notifications,
		unreadCount,
		mounted,
		settings,
		updateSettings,
		notify,
		markAsRead: read,
		markAllAsRead: readAll,
		deleteNotification: remove,
		clearNotifications: clear,
		refresh,
	};
}

// Helper to persist a merged notification list locally (used when pulling the
// authoritative list from the server). Kept outside the hook to avoid stale
// closures; it dispatches the update event so other listeners refresh too.
function saveNotificationsMerged(list: Notification[]) {
	if (typeof window === "undefined") return;
	const local = getNotifications();
	const localIds = new Set(local.map((n) => n.id));
	const merged = [...list, ...local.filter((n) => !localIds.has(n.id))].slice(0, 100);
	try {
		localStorage.setItem(
			`rumer_notifications_${getCurrentUserId()}`,
			JSON.stringify(merged)
		);
	} catch {
		/* ignore */
	}
	try {
		window.dispatchEvent(new Event("rumer-notifications-updated"));
	} catch {
		/* ignore */
	}
}

// Merge newly-inserted server notification rows (from Realtime) into local
// storage so the notification appears immediately without a full refetch.
function receiveServerNotifications(rows: Record<string, unknown>[]) {
	if (typeof window === "undefined") return;
	if (!rows.length) return;
	const local = getNotifications();
	const localIds = new Set(local.map((n) => n.id));
	const merged = [...local];
	for (const row of rows) {
		const id = row.id as string;
		if (!id || localIds.has(id)) continue;
		merged.unshift({
			id,
			title: String(row.title || ""),
			message: String(row.message || ""),
			type: (row.type as Notification["type"]) || "info",
			read: Boolean(row.read),
			link: row.link ? String(row.link) : undefined,
			image: row.image ? String(row.image) : undefined,
			createdAt: String(row.created_at || new Date().toISOString()),
		});
		localIds.add(id);
	}
	saveNotifications(merged.slice(0, 100));
	latestRefresh?.();
}

// Re-fetch the authoritative list from the server and merge locally. Used by
// realtime fallback listeners (products / inventory / transactions) in case
// the owner can't subscribe to the notifications table directly.
function fetchFreshAndMerge() {
	if (typeof window === "undefined") return;
	fetchRemoteNotifications().then((remote) => {
		if (!remote) return;
		saveNotificationsMerged(remote);
	});
}
