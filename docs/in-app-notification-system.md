# Rumer Notification System

## Overview

The Rumer notification system provides real-time notifications to users about important account activity, order updates, product changes, and transactions. The system uses a hybrid architecture combining localStorage for offline capability with Supabase backend for persistence, real-time delivery, and web push notifications.

---

## Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Side                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │  NotificationBell │    │ NotificationsPage │                   │
│  │    (Dropdown)     │    │   (Full Page)     │                   │
│  └────────┬─────────┘    └────────┬─────────┘                   │
│           │                       │                              │
│           └───────────┬───────────┘                              │
│                       │                                          │
│           ┌───────────▼───────────┐                              │
│           │    useNotifications    │                              │
│           │       (Hook)          │                              │
│           └───────────┬───────────┘                              │
│                       │                                          │
│           ┌───────────▼───────────┐                              │
│           │   notifications.ts    │                              │
│           │   (localStorage)      │                              │
│           └───────────┬───────────┘                              │
│                       │                                          │
│           ┌───────────▼───────────┐                              │
│           │ notificationsServer.ts│                              │
│           │    (API Client)       │                              │
│           └───────────┬───────────┘                              │
│                       │                                          │
│           ┌───────────▼───────────┐                              │
│           │  pushNotifications.ts │                              │
│           │  (Push Manager)       │                              │
│           └───────────┬───────────┘                              │
│                       │                                          │
│           ┌───────────▼───────────┐                              │
│           │      Service Worker   │                              │
│           │      (sw.js)          │                              │
│           └───────────┬───────────┘                              │
│                       │                                          │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Server Side                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │  /api/notifications│   │   Supabase DB     │                  │
│  │    (REST API)     │◄──►│  (notifications)  │                  │
│  └──────────────────┘    └──────────────────┘                   │
│                                                                   │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │  /api/notifications│   │  Web Push (VAPID) │                  │
│  │  /push-subscription│◄──►│  (web-push)      │                  │
│  └──────────────────┘    └──────────────────┘                   │
│                                                                   │
│  ┌──────────────────────────────────────────┐                   │
│  │         Supabase Realtime                 │                   │
│  │    (Postgres Changes Subscription)        │                   │
│  └──────────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Model

### Notification Interface

```typescript
interface Notification {
  id: string;              // Unique identifier (timestamp + random)
  title: string;           // Notification title
  message: string;         // Notification message body
  type: NotificationType;  // "info" | "success" | "warning" | "error"
  read: boolean;           // Whether the notification has been read
  createdAt: string;       // ISO timestamp
  link?: string;           // Optional URL to navigate to on click
  image?: string;          // Optional image URL
}
```

### Notification Types

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| `info` | Info | Blue | General information, updates |
| `success` | CheckCircle | Green | Completed actions, confirmations |
| `warning` | AlertTriangle | Yellow | Warnings, attention needed |
| `error` | AlertCircle | Red | Errors, failed operations |

### Notification Settings

```typescript
interface NotificationSettings {
  in_app: boolean;   // Show notifications in the bell
  push: boolean;     // Send push notifications to device
  email: boolean;    // Send email notifications
}
```

### Push Subscription

```typescript
interface PushSubscription {
  endpoint: string;     // Push service endpoint
  keys: {
    p256dh: string;    // Public key for encryption
    auth: string;      // Authentication secret
  };
}
```

---

## File Structure

```
src/
├── components/
│   ├── lib/
│   │   ├── notifications.ts          # Local storage operations
│   │   ├── notificationsServer.ts    # Server API client
│   │   └── pushNotifications.ts      # Push notification manager
│   ├── hooks/
│   │   └── useNotifications.ts       # React hook for notifications
│   └── reusables/
│       ├── NotificationBell.tsx      # Bell dropdown component
│       ├── NotificationPreferences.tsx # Settings component
│       └── ServiceWorkerRegistrar.tsx # SW registration component
├── app/
│   ├── notifications/
│   │   └── page.tsx                  # Full notifications page
│   └── api/
│       └── notifications/
│           ├── route.ts              # GET/POST notifications
│           ├── [id]/
│           │   └── route.ts          # PATCH/DELETE single notification
│           ├── mark-all-read/
│           │   └── route.ts          # PATCH mark all as read
│           ├── clear/
│           │   └── route.ts          # DELETE clear all
│           ├── preferences/
│           │   └── route.ts          # GET/PUT notification settings
│           ├── push-subscription/
│           │   └── route.ts          # POST/DELETE push subscriptions
│           └── send-push/
│               └── route.ts          # POST send push notification
public/
└── sw.js                              # Service Worker for push
```

---

## Key Features

### 1. Dual Storage System

The system maintains notifications in two locations:

**localStorage (Client)**
- Immediate access without network
- Works offline
- Key: `rumer_notifications_{userId}`
- Maximum 100 notifications stored

**Supabase Database (Server)**
- Persistent storage
- Synced across devices
- Real-time updates via WebSocket

### 2. Real-Time Delivery

The system uses Supabase Realtime to receive notifications instantly:

```typescript
// Subscribe to notifications table changes
realtimeChannel.on(
  "postgres_changes",
  {
    event: "INSERT",
    schema: "public",
    table: "notifications",
    filter: `user_id=eq.${userId}`,
  },
  (payload) => {
    // Handle new notification
    receiveServerNotifications([payload.new]);
  }
)
```

**Additional Realtime Subscriptions:**
- `products` table updates (owner's products)
- `inventory` table updates (owner's inventory)
- `transactions` table inserts (buyer/seller transactions)

### 3. Cross-Tab Synchronization

Notifications sync across browser tabs using:

```typescript
// BroadcastChannel API
const channel = new BroadcastChannel("rumer-notifications");
channel.onmessage = (event) => {
  if (event.data?.type === "updated") {
    refresh();
  }
};

// Fallback: storage event
window.addEventListener("storage", handleUpdate);
```

### 4. Duplicate Prevention

The system prevents duplicate notifications within a 5-second window:

```typescript
const fiveSecondsAgo = Date.now() - 5000;
const isDuplicate = notifications.some(
  (n) =>
    !n.read &&
    n.title === notification.title &&
    n.message === notification.message &&
    new Date(n.createdAt).getTime() > fiveSecondsAgo
);
```

### 5. Toast Notifications

New notifications trigger a toast popup (when dropdown is closed):

- Appears at top-right of screen
- Auto-dismisses after 5 seconds
- Shows notification type icon and colors
- Can be manually dismissed

### 6. Push Notifications

Web push notifications allow users to receive alerts even when the app is not open.

**How It Works:**

1. **Service Worker Registration**
   - Registered on app load via `ServiceWorkerRegistrar`
   - Handles push events and notification clicks

2. **Permission Request**
   - User enables push notifications in Settings
   - Browser prompts for permission
   - Permission state: `granted`, `denied`, or `default`

3. **Subscription**
   - Browser generates push subscription with VAPID keys
   - Subscription saved to `push_subscriptions` table
   - Server can send push notifications via web-push library

4. **Delivery**
   - When notification created, server checks user's push preference
   - If enabled, sends push to all user's subscriptions
   - Invalid subscriptions (404/410) are automatically cleaned up

**Push Notification Flow:**

```
User enables push → Browser requests permission → Permission granted
    ↓
Service Worker registers → Push subscription created
    ↓
Subscription saved to server → Ready to receive push notifications
    ↓
Notification event occurs → Server creates in-app notification
    ↓
Server sends push via web-push → Service Worker receives push event
    ↓
Service Worker shows notification → User clicks notification
    ↓
Browser opens/focuses app → Navigates to relevant page
```

---

## API Endpoints

### Notifications

#### GET /api/notifications
Fetch all notifications for the authenticated user.

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "...",
      "title": "...",
      "message": "...",
      "type": "info",
      "read": false,
      "link": "/dashboard/orders",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ]
}
```

#### POST /api/notifications
Create a new notification and optionally send push notification.

**Request Body:**
```json
{
  "title": "Order Update",
  "message": "Your order has been shipped",
  "type": "success",
  "link": "/dashboard/orders/123"
}
```

#### PATCH /api/notifications/[id]
Mark a notification as read.

#### DELETE /api/notifications/[id]
Delete a single notification.

#### PATCH /api/notifications/mark-all-read
Mark all notifications as read.

#### DELETE /api/notifications/clear
Clear all notifications.

### Notification Settings

#### GET /api/notifications/preferences
Fetch notification settings.

#### PUT /api/notifications/preferences
Update notification settings.

**Request Body:**
```json
{
  "in_app": true,
  "push": true,
  "email": false
}
```

### Push Subscriptions

#### POST /api/notifications/push-subscription
Save a push subscription for the authenticated user.

**Request Body:**
```json
{
  "endpoint": "https://fcm.googleapis.com/...",
  "keys": {
    "p256dh": "base64-encoded-key",
    "auth": "base64-encoded-auth"
  }
}
```

#### DELETE /api/notifications/push-subscription
Remove push subscription.

**Query Parameters:**
- `endpoint` (optional): Specific endpoint to delete. If omitted, deletes all user's subscriptions.

### Push Notifications

#### POST /api/notifications/send-push
Send push notification to a user (server-side only).

**Request Body:**
```json
{
  "userId": "user-uuid",
  "notification": {
    "title": "New Order",
    "message": "You have a new order #ORD-123",
    "tag": "order-update",
    "url": "/dashboard/orders/123"
  }
}
```

---

## Environment Variables

```env
# VAPID Keys for Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_EMAIL=mailto:noreply@rumer.ng
```

Generate VAPID keys:
```bash
npx web-push generate-vapid-keys
```

---

## Database Schema

### push_subscriptions Table

```sql
CREATE TABLE push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- Row Level Security
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own push subscriptions"
  ON push_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own push subscriptions"
  ON push_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own push subscriptions"
  ON push_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);
```

---

## Usage Examples

### Adding a Notification (In-App + Push)

```typescript
import { addNotification } from "@/components/lib/notifications";

// Add notification (automatically sends push if user has enabled it)
addNotification({
  title: "Order Confirmed",
  message: "Your order #ORD-12345 has been confirmed",
  type: "success",
  link: "/dashboard/orders/12345",
});
```

### Using the Hook

```typescript
import { useNotifications } from "@/components/hooks/useNotifications";

function MyComponent() {
  const {
    notifications,      // Array of Notification objects
    unreadCount,        // Number of unread notifications
    mounted,            // Whether component has mounted
    settings,           // NotificationSettings object
    notify,             // Add notification function
    markAsRead,         // Mark single as read
    markAllAsRead,      // Mark all as read
    deleteNotification, // Delete single notification
    clearNotifications, // Clear all notifications
    updateSettings,     // Update notification settings
  } = useNotifications();

  // Example: Notify on action
  const handleSave = async () => {
    await saveData();
    notify({
      title: "Saved",
      message: "Your changes have been saved",
      type: "success",
    });
  };
}
```

### Push Notification Utilities

```typescript
import {
  isPushNotificationSupported,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} from "@/components/lib/pushNotifications";

// Check if push is supported
if (isPushNotificationSupported()) {
  // Request permission
  const permission = await requestNotificationPermission();
  
  if (permission === "granted") {
    // Subscribe to push
    const subscription = await subscribeToPushNotifications();
    if (subscription) {
      // Subscription is automatically saved to server
      console.log("Push notifications enabled!");
    }
  }
}
```

### NotificationBell Component

```typescript
import NotificationBell from "@/components/reusables/NotificationBell";

// Light variant (for light backgrounds)
<NotificationBell variant="light" />

// Dark variant (for dark backgrounds)
<NotificationBell variant="dark" />
```

---

## User Interface

### Notification Bell (Header)

- **Location:** Top-right corner of header
- **Badge:** Shows unread count (max "9+")
- **Dropdown:** Shows 5 most recent notifications
- **Actions:** Mark as read, delete, view all
- **Toast:** New notifications show toast popup

### Notifications Page

- **URL:** `/notifications`
- **Filters:** All, Unread, Read
- **Actions:** Mark all read, Clear all
- **Pagination:** Automatic

### Notification Preferences

- **Location:** Dashboard → Settings
- **Options:**
  - In-app notifications (toggle)
  - Push notifications (toggle) - requires browser permission
  - Email notifications (toggle)

---

## Notification Triggers

The system generates notifications for various events:

### Order Events
- Order created
- Order status changed
- Payment received
- Order shipped
- Order delivered

### Product Events
- Product approved
- Product rejected
- Product updated
- Inventory low

### Account Events
- KYC verified
- KYC rejected
- Profile updated
- Password changed

### Transaction Events
- Payment successful
- Payment failed
- Refund processed
- Escrow released

---

## Best Practices

### For Developers

1. **Use appropriate notification types:**
   - `success` for completed actions
   - `error` for failures requiring attention
   - `warning` for important but non-critical updates
   - `info` for general information

2. **Include actionable links:**
   ```typescript
   addNotification({
     title: "New Order",
     message: "You have a new order #ORD-123",
     type: "info",
     link: "/dashboard/orders/123", // Always link to relevant page
   });
   ```

3. **Keep messages concise:**
   - Title: 5-8 words
   - Message: 1-2 sentences

4. **Avoid notification spam:**
   - The system prevents duplicates within 5 seconds
   - Don't notify for every minor action

5. **Push notifications:**
   - Only send for important events
   - Include clear, actionable titles
   - Always include a link to relevant content

### For Users

1. **Manage preferences:** Adjust notification settings in Settings
2. **Enable push notifications:** Stay updated even when app is closed
3. **Use filters:** Filter by read/unread on the Notifications page
4. **Mark as read:** Keep unread count low for better visibility
5. **Clear old notifications:** Regularly clear notifications you no longer need

---

## Technical Details

### Storage Limits
- Maximum notifications per user: 100
- Oldest notifications are removed when limit is exceeded

### Sync Behavior
- Local changes sync to server immediately
- Server changes sync to client via Realtime
- Cross-tab sync via BroadcastChannel
- Push notifications sent asynchronously

### Error Handling
- Graceful degradation when offline
- Local notifications work without server
- Server sync retries automatically
- Invalid push subscriptions auto-cleaned

### Performance
- Notifications lazy-loaded on mount
- Efficient re-renders via React hooks
- Minimal network requests
- Push notifications sent in background

---

## Troubleshooting

### Notifications not appearing
1. Check if in-app notifications are enabled in settings
2. Verify user is authenticated
3. Check browser console for errors
4. Clear localStorage and refresh

### Notifications not syncing across tabs
1. Ensure BroadcastChannel is supported
2. Check for browser extensions blocking it
3. Refresh all tabs

### Real-time notifications not working
1. Verify Supabase connection
2. Check network connectivity
3. Ensure Realtime is enabled for the notifications table

### Push notifications not working
1. Check browser support: `isPushNotificationSupported()`
2. Verify VAPID keys are configured in `.env.local`
3. Check if user granted permission: `Notification.permission`
4. Verify `push_subscriptions` table exists in Supabase
5. Check server logs for push delivery errors
6. Ensure service worker is registered: Application → Service Workers

### Push subscription errors
1. **404/410 errors:** Subscription expired or invalid, automatically cleaned up
2. **401 errors:** VAPID keys misconfigured
3. **Quota exceeded:** Too many subscriptions, older ones are removed

---

## Future Enhancements

1. ~~**Push Notifications:** Web Push API integration~~ ✅ Implemented
2. **Email Notifications:** SendGrid/SES integration
3. **Notification Groups:** Category-based filtering
4. **Scheduled Notifications:** Time-based delivery
5. **Rich Notifications:** Images, actions, expandable content
6. **Notification Analytics:** Read rates, engagement metrics
7. **Notification Templates:** Reusable message templates
8. **Batch Notifications:** Send to multiple users at once

---

*Last updated: August 2025*
