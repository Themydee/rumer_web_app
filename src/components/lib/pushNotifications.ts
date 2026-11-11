"use client";

// VAPID public key for web push notifications
// In production, generate your own keys using: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";

// Convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray as BufferSource;
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  url?: string;
  data?: Record<string, unknown>;
  actions?: Array<{ action: string; title: string; icon?: string }>;
}

/**
 * Check if push notifications are supported in the browser
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "PushManager" in window;
}

/**
 * Check if notification permission is granted
 */
export function isNotificationPermissionGranted(): boolean {
  if (typeof window === "undefined") return false;
  return Notification.permission === "granted";
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined") return "denied";

  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Register the service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    console.log("Service Worker registered:", registration.scope);
    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
}

/**
 * Get the current push subscription
 */
export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!isPushNotificationSupported()) return null;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) return null;

  const p256dh = subscription.toJSON().keys?.p256dh;
  const auth = subscription.toJSON().keys?.auth;

  if (!p256dh || !auth) return null;

  return {
    endpoint: subscription.endpoint,
    keys: {
      p256dh,
      auth,
    },
  };
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  if (!isPushNotificationSupported()) {
    console.warn("Push notifications are not supported");
    return null;
  }

  if (!VAPID_PUBLIC_KEY) {
    console.warn("VAPID public key is not configured");
    return null;
  }

  try {
    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const p256dh = subscription.toJSON().keys?.p256dh;
    const auth = subscription.toJSON().keys?.auth;

    if (!p256dh || !auth) {
      console.error("Missing subscription keys");
      return null;
    }

    const pushSubscription: PushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh,
        auth,
      },
    };

    return pushSubscription;
  } catch (error) {
    console.error("Failed to subscribe to push notifications:", error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  if (!isPushNotificationSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }

    return false;
  } catch (error) {
    console.error("Failed to unsubscribe from push notifications:", error);
    return false;
  }
}

/**
 * Save push subscription to server
 */
export async function savePushSubscription(subscription: PushSubscription): Promise<boolean> {
  try {
    const token = localStorage.getItem("rumer_auth_token");
    if (!token) return false;

    const res = await fetch("/api/notifications/push-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });

    return res.ok;
  } catch (error) {
    console.error("Failed to save push subscription:", error);
    return false;
  }
}

/**
 * Delete push subscription from server
 */
export async function deletePushSubscription(): Promise<boolean> {
  try {
    const token = localStorage.getItem("rumer_auth_token");
    if (!token) return false;

    const res = await fetch("/api/notifications/push-subscription", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.ok;
  } catch (error) {
    console.error("Failed to delete push subscription:", error);
    return false;
  }
}

/**
 * Initialize push notifications
 * - Register service worker
 * - Request permission
 * - Subscribe to push
 * - Save subscription to server
 */
export async function initializePushNotifications(): Promise<boolean> {
  if (!isPushNotificationSupported()) {
    return false;
  }

  const registration = await registerServiceWorker();
  if (!registration) {
    return false;
  }

  const subscription = await subscribeToPushNotifications();
  if (!subscription) {
    return false;
  }

  const saved = await savePushSubscription(subscription);
  return saved;
}

/**
 * Show a local notification (for testing or in-app triggers)
 */
export async function showLocalNotification(options: PushNotificationOptions): Promise<void> {
  if (!isNotificationPermissionGranted()) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification(options.title, {
    body: options.body,
    icon: options.icon || "/icons/notification-icon.png",
    badge: options.badge || "/icons/badge-icon.png",
    tag: options.tag || "rumer-local",
    data: {
      url: options.url || "/notifications",
      ...options.data,
    },
  });
}
