"use client";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
	id: string;
	title: string;
	message: string;
	type: NotificationType;
	read: boolean;
	createdAt: string;
	link?: string;
	image?: string;
}

const STORAGE_KEY = "rumer_notifications";

function getStorageKey(userId?: string): string {
	return userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
}

export function getCurrentUserId(): string | undefined {
	if (typeof window === "undefined") return undefined;
	try {
		const token = localStorage.getItem("rumer_auth_token");
		if (!token) return "guest";
		const payload = JSON.parse(atob(token.split(".")[1]));
		return payload.userId || payload.sub || payload.id || "guest";
	} catch {
		return "guest";
	}
}

export function getNotifications(userId?: string): Notification[] {
	if (typeof window === "undefined") return [];
	try {
		const stored = localStorage.getItem(getStorageKey(userId || getCurrentUserId()));
		if (!stored) return [];
		const parsed = JSON.parse(stored);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function broadcastUpdate() {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new Event("rumer-notifications-updated"));
	try {
		const channel = new BroadcastChannel("rumer-notifications");
		channel.postMessage({ type: "updated" });
		channel.close();
	} catch {
		// BroadcastChannel not supported
	}
}

export function saveNotifications(notifications: Notification[], userId?: string): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(
		getStorageKey(userId || getCurrentUserId()),
		JSON.stringify(notifications)
	);
	broadcastUpdate();
}

export function addNotification(
	notification: Omit<Notification, "id" | "createdAt" | "read">,
	userId?: string
): Notification[] {
	const targetUserId = userId || getCurrentUserId();
	const notifications = getNotifications(targetUserId);

	// Avoid duplicate bursts: skip if an identical unread notification was added very recently.
	const fiveSecondsAgo = Date.now() - 5000;
	const isDuplicate = notifications.some(
		(n) =>
			!n.read &&
			n.title === notification.title &&
			n.message === notification.message &&
			new Date(n.createdAt).getTime() > fiveSecondsAgo
	);
	if (isDuplicate) return notifications;

	const newNotification: Notification = {
		...notification,
		id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		createdAt: new Date().toISOString(),
		read: false,
	};
	const updated = [newNotification, ...notifications].slice(0, 100);
	saveNotifications(updated, targetUserId);
	return updated;
}

export function markAsRead(id: string, userId?: string): Notification[] {
	const notifications = getNotifications(userId).map((n) =>
		n.id === id ? { ...n, read: true } : n
	);
	saveNotifications(notifications, userId);
	return notifications;
}

export function markAllAsRead(userId?: string): Notification[] {
	const notifications = getNotifications(userId).map((n) => ({ ...n, read: true }));
	saveNotifications(notifications, userId);
	return notifications;
}

export function deleteNotification(id: string, userId?: string): Notification[] {
	const notifications = getNotifications(userId).filter((n) => n.id !== id);
	saveNotifications(notifications, userId);
	return notifications;
}

export function clearNotifications(userId?: string): void {
	saveNotifications([], userId);
}

export function getUnreadCount(userId?: string): number {
	return getNotifications(userId).filter((n) => !n.read).length;
}

export function areInAppNotificationsEnabled(): boolean {
	if (typeof window === "undefined") return true;
	try {
		const settings = localStorage.getItem("rumer_notification_settings");
		if (!settings) return true;
		const parsed = JSON.parse(settings);
		return parsed.in_app !== false && parsed.inApp !== false;
	} catch {
		return true;
	}
}

export interface NotificationSettings {
	in_app: boolean;
	push: boolean;
	email: boolean;
}

const SETTINGS_STORAGE_KEY = "rumer_notification_settings";

export function getNotificationSettings(): NotificationSettings {
	if (typeof window === "undefined") {
		return { in_app: true, push: true, email: false };
	}
	try {
		const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
		if (!stored) return { in_app: true, push: true, email: false };
		const parsed = JSON.parse(stored);
		return {
			in_app: parsed.in_app ?? parsed.inApp ?? true,
			push: parsed.push ?? true,
			email: parsed.email ?? false,
		};
	} catch {
		return { in_app: true, push: true, email: false };
	}
}

export function saveNotificationSettings(settings: NotificationSettings): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
	broadcastUpdate();
}
