// Rumer Push Notification Service Worker

const CACHE_NAME = "rumer-v1";
const OFFLINE_URL = "/offline.html";

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", OFFLINE_URL]).catch(() => {
        // Ignore cache errors
      });
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Push event - Handle incoming push notifications
self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch {
    data = {
      title: "Rumer",
      body: event.data.text(),
    };
  }

  const options = {
    body: data.body || "You have a new notification",
    icon: data.icon || "/icons/notification-icon.png",
    badge: data.badge || "/icons/badge-icon.png",
    image: data.image,
    tag: data.tag || "rumer-notification",
    data: {
      url: data.url || "/notifications",
      ...data.data,
    },
    actions: data.actions || [],
    vibrate: [100, 50, 100],
    timestamp: data.timestamp || Date.now(),
    renotify: true,
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Rumer", options)
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/notifications";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Check if there's already a window open
      for (const client of windowClients) {
        if (client.url.includes(self.registration.scope) && "focus" in client) {
          client.focus();
          client.navigate(urlToOpen);
          return;
        }
      }

      // Open new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Notification close event
self.addEventListener("notificationclose", (event) => {
  // Track notification dismissal if needed
});

// Background sync for offline notifications
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-notifications") {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  // Sync any pending notifications when back online
  try {
    const cache = await caches.open("pending-notifications");
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const notification = await response.json();
        // Re-send the notification
        await self.registration.showNotification(notification.title, {
          body: notification.body,
          icon: notification.icon,
          tag: notification.tag,
        });
        await cache.delete(request);
      }
    }
  } catch (error) {
    console.error("Sync notifications error:", error);
  }
}
