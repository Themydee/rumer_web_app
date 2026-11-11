"use client";

import { useEffect } from "react";
import {
  registerServiceWorker,
  isPushNotificationSupported,
  initializePushNotifications,
} from "@/components/lib/pushNotifications";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Initialize push notifications if supported
    if (isPushNotificationSupported()) {
      // Auto-subscribe if user is logged in and hasn't denied permission
      const initPush = async () => {
        try {
          const token = localStorage.getItem("rumer_auth_token");
          if (token) {
            // User is logged in, try to initialize push notifications
            await initializePushNotifications();
          }
        } catch (error) {
          // Silently fail - push notifications are optional
          console.debug("Push notification initialization skipped:", error);
        }
      };

      // Delay initialization to not block page load
      setTimeout(initPush, 2000);
    }
  }, []);

  // This component doesn't render anything
  return null;
}
