"use client";

import type { Notification, NotificationType } from "./notifications";

interface ServerNotification {
	id: string;
	title: string;
	message: string;
	type: NotificationType;
	read: boolean;
	link: string | null;
	image: string | null;
	created_at: string;
}

export interface NotificationSettings {
	in_app: boolean;
	push: boolean;
	email: boolean;
}

async function api<T = unknown>(
	path: string,
	options?: RequestInit
): Promise<{ ok: boolean; data: T | null }> {
	const token =
		typeof window !== "undefined"
			? localStorage.getItem("rumer_auth_token")
			: null;
	if (!token) return { ok: false, data: null };

	try {
		const res = await fetch(path, {
			...options,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
				...(options?.headers || {}),
			},
		});
		if (!res.ok) return { ok: false, data: null };
		const data = (await res.json()) as T;
		return { ok: true, data };
	} catch {
		return { ok: false, data: null };
	}
}

function toLocal(server: ServerNotification): Notification {
	return {
		id: server.id,
		title: server.title,
		message: server.message,
		type: server.type,
		read: server.read,
		createdAt: server.created_at,
		link: server.link || undefined,
		image: server.image || undefined,
	};
}

export async function fetchRemoteNotifications(): Promise<Notification[] | null> {
	const { ok, data } = await api<{ success: boolean; notifications: ServerNotification[] }>(
		"/api/notifications"
	);
	if (!ok || !data?.notifications) return null;
	return data.notifications.map(toLocal);
}

export async function createRemoteNotification(
	notification: Omit<Notification, "id" | "createdAt" | "read">
): Promise<boolean> {
	const { ok } = await api("/api/notifications", {
		method: "POST",
		body: JSON.stringify(notification),
	});
	return ok;
}

export async function markRemoteRead(id: string): Promise<boolean> {
	const { ok } = await api(`/api/notifications/${encodeURIComponent(id)}`, {
		method: "PATCH",
	});
	return ok;
}

export async function deleteRemoteNotification(id: string): Promise<boolean> {
	const { ok } = await api(`/api/notifications/${encodeURIComponent(id)}`, {
		method: "DELETE",
	});
	return ok;
}

export async function markAllRemoteRead(): Promise<boolean> {
	const { ok } = await api("/api/notifications/mark-all-read", {
		method: "PATCH",
	});
	return ok;
}

export async function clearRemoteNotifications(): Promise<boolean> {
	const { ok } = await api("/api/notifications/clear", {
		method: "DELETE",
	});
	return ok;
}

export async function fetchRemoteSettings(): Promise<NotificationSettings | null> {
	const { ok, data } = await api<{
		success: boolean;
		settings: NotificationSettings;
	}>("/api/notifications/preferences");
	if (!ok || !data?.settings) return null;
	return data.settings;
}

export async function updateRemoteSettings(
	settings: Partial<NotificationSettings>
): Promise<NotificationSettings | null> {
	const { ok, data } = await api<{
		success: boolean;
		settings: NotificationSettings;
	}>("/api/notifications/preferences", {
		method: "PUT",
		body: JSON.stringify(settings),
	});
	if (!ok || !data?.settings) return null;
	return data.settings;
}
