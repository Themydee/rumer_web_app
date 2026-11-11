"use client";

import React, { useState } from "react";
import { BellRing, Mail, Smartphone } from "lucide-react";
import { useNotifications } from "@/components/hooks/useNotifications";
import {
  isPushNotificationSupported,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  savePushSubscription,
  deletePushSubscription,
} from "@/components/lib/pushNotifications";

function Toggle({
	checked,
	onChange,
	disabled,
}: {
	checked: boolean;
	onChange: (value: boolean) => void;
	disabled?: boolean;
}) {
	return (
		<button
			type='button'
			role='switch'
			aria-checked={checked}
			disabled={disabled}
			onClick={() => onChange(!checked)}
			className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#014834]/30 ${
				checked ? "bg-[#014834]" : "bg-gray-300"
			} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
		>
			<span
				className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
					checked ? "translate-x-5" : "translate-x-0.5"
				}`}
			/>
		</button>
	);
}

interface PreferenceRowProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	checked: boolean;
	onChange: (value: boolean) => void;
	disabled?: boolean;
}

function PreferenceRow({
	icon,
	title,
	description,
	checked,
	onChange,
	disabled,
}: PreferenceRowProps) {
	return (
		<div
			className={`flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 ${
				disabled ? "opacity-60" : ""
			}`}
		>
			<div className='flex items-start gap-3 pr-4'>
				<div className='w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0'>
					{icon}
				</div>
				<div>
					<p className='text-sm font-semibold text-gray-900'>{title}</p>
					<p className='text-xs text-gray-500 mt-0.5'>{description}</p>
				</div>
			</div>
			<Toggle checked={checked} onChange={onChange} disabled={disabled} />
		</div>
	);
}

export default function NotificationPreferences() {
	const { settings, updateSettings, mounted } = useNotifications();
	const [saved, setSaved] = useState(false);

	if (!mounted) {
		return (
			<div className='text-sm text-gray-400 py-4'>Loading notification preferences…</div>
		);
	}

	const handleChange = (key: "in_app" | "push" | "email") => async (value: boolean) => {
		updateSettings({ [key]: value });
		setSaved(true);
		setTimeout(() => setSaved(false), 2000);

		// Handle push notification subscription/unsubscription
		if (key === "push" && isPushNotificationSupported()) {
			try {
				if (value) {
					// User enabled push notifications - subscribe
					const subscription = await subscribeToPushNotifications();
					if (subscription) {
						await savePushSubscription(subscription);
					}
				} else {
					// User disabled push notifications - unsubscribe
					await unsubscribeFromPushNotifications();
					await deletePushSubscription();
				}
			} catch (error) {
				console.error("Failed to update push notification subscription:", error);
			}
		}
	};

	return (
		<div>
			<div className='mb-4 flex items-center justify-between'>
				<div>
					<h3 className='text-lg font-semibold text-gray-900'>
						Notification preferences
					</h3>
					<p className='text-sm text-gray-500 mt-0.5'>
						Choose how you want to be notified about activity on your account.
					</p>
				</div>
				{saved && (
					<span className='text-xs font-medium text-emerald-600'>Saved</span>
				)}
			</div>

			<div className='bg-white border border-gray-100 rounded-2xl px-6 py-2'>
				<PreferenceRow
					icon={<BellRing className='w-4 h-4' />}
					title='In-app notifications'
					description='Show notifications in the bell on Rumer.'
					checked={settings.in_app}
					onChange={handleChange("in_app")}
				/>
				<PreferenceRow
					icon={<Smartphone className='w-4 h-4' />}
					title='Push notifications'
					description='Receive push notifications on your browser. Your browser will ask for permission when enabled.'
					checked={settings.push}
					onChange={handleChange("push")}
					disabled={!isPushNotificationSupported()}
				/>
				<PreferenceRow
					icon={<Mail className='w-4 h-4' />}
					title='Email notifications'
					description='Get email updates for important account activity.'
					checked={settings.email}
					onChange={handleChange("email")}
				/>
			</div>

			<p className='text-xs text-gray-400 mt-3'>
				Your preferences are saved automatically and synced across devices when
				you're signed in.
			</p>
		</div>
	);
}