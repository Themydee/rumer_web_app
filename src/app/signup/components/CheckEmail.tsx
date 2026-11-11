"use client";
import React, { useState } from "react";
import { Button } from "@heroui/react";
import AuthLayout from "./AuthLayout";
import { resendVerificationCode } from "@/components/lib/supabase/auth";

interface CheckEmailProps {
	email: string;
	name?: string;
	onContinue: () => void;
	onBack?: () => void;
}

const CheckEmail = ({ email, name, onContinue, onBack }: CheckEmailProps) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [resendCooldown, setResendCooldown] = useState(0);

	const handleResend = async () => {
		if (resendCooldown > 0) return;
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const result = await resendVerificationCode(email);
			if (result.success) {
				setSuccess(true);
				setResendCooldown(60);
				const interval = setInterval(() => {
					setResendCooldown((prev) => {
						if (prev <= 1) {
							clearInterval(interval);
							return 0;
						}
						return prev - 1;
					});
				}, 1000);
			} else {
				setError(result.error || "Failed to resend code");
			}
		} catch (err) {
			setError("Failed to resend code. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthLayout showBack onBack={onBack} step={1}>
			<div className="text-center">
				{/* Email Icon */}
				<div className="w-20 h-20 bg-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
					<svg
						className="w-10 h-10 text-white"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						/>
					</svg>
				</div>

				<h1 className="text-2xl font-bold text-gray-900 mb-3">
					Check your email
				</h1>
				<p className="text-gray-600 mb-6">
					We&apos;ve sent a verification link to{" "}
					<span className="font-medium text-gray-900">{email}</span> with a 6 digit code.
				</p>

				{/* Email Client Icons */}
				<div className="flex items-center justify-center gap-4 mb-8">
					<button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<svg className="w-5 h-5" viewBox="0 0 24 24">
							<path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
							<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
							<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
							<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
						</svg>
						<span className="text-sm font-medium text-gray-700">Open Gmail</span>
					</button>
					<button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<svg className="w-5 h-5" viewBox="0 0 24 24">
							<path fill="#0078D4" d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"/>
						</svg>
						<span className="text-sm font-medium text-gray-700">Open Outlook</span>
					</button>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
						<p className="text-sm text-red-600">{error}</p>
					</div>
				)}

				{success && (
					<div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
						<p className="text-sm text-green-600">
							Verification email sent successfully!
						</p>
					</div>
				)}

				<div className="space-y-3">
					<p className="text-sm text-gray-600">
						Didn&apos;t get an email? Check your spam folder!
					</p>
					<button
						onClick={handleResend}
						disabled={loading || resendCooldown > 0}
						className={`text-sm font-medium hover:underline ${
							resendCooldown > 0
								? "text-gray-400 cursor-not-allowed"
								: "text-[#014834]"
						}`}
					>
						{loading
							? "Sending..."
							: resendCooldown > 0
							? `Resend in ${resendCooldown}s`
							: "or try another email address"}
					</button>
				</div>

				<Button
					onClick={onContinue}
					className="w-full bg-[#014834] text-white font-medium py-3 rounded-xl hover:bg-[#013628] transition-colors mt-8"
				>
					Continue
				</Button>
			</div>
		</AuthLayout>
	);
};

export default CheckEmail;
