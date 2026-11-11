"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/react";
import AuthLayout from "./AuthLayout";
import { verifyEmail, resendVerificationCode } from "@/components/lib/supabase/auth";

interface VerifyOTPProps {
	phone?: string;
	email?: string;
	mode: "phone" | "email";
	onVerified: () => void;
	onBack?: () => void;
}

const VerifyOTP = ({ phone, email, mode, onVerified, onBack }: VerifyOTPProps) => {
	const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
	const [error, setError] = useState("");
	const [verifying, setVerifying] = useState(false);
	const [resendCooldown, setResendCooldown] = useState(30);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		if (resendCooldown > 0) {
			const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [resendCooldown]);

	const handleChange = (index: number, value: string) => {
		if (value.length > 1) {
			value = value.slice(-1);
		}

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);
		setError("");

		// Auto-focus next input
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
		const newOtp = [...otp];
		pastedData.split("").forEach((char, i) => {
			if (i < 6) newOtp[i] = char;
		});
		setOtp(newOtp);
		if (pastedData.length > 0) {
			inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
		}
	};

	const handleSubmit = async () => {
		const otpString = otp.join("");
		if (otpString.length !== 6) {
			setError("Please enter the complete 6-digit code");
			return;
		}

		if (mode === "phone") {
			// Phone verification is not wired to the backend yet.
			onVerified();
			return;
		}

		setVerifying(true);
		setError("");
		try {
			const result = await verifyEmail(otpString, email || "");
			if (result.success) {
				onVerified();
			} else {
				setError(result.error || "Invalid code. Please try again.");
			}
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setVerifying(false);
		}
	};

	const handleResend = async () => {
		if (resendCooldown > 0) return;
		if (mode === "phone") {
			setResendCooldown(30);
			return;
		}
		try {
			await resendVerificationCode(email || "");
		} catch {
			// ignore resend errors
		}
		setResendCooldown(30);
	};

	const maskedContact = mode === "phone"
		? phone?.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2") || "0000000000"
		: email?.replace(/(.{2})(.*)(@.*)/, "$1***$3") || "email";

	const title = mode === "phone"
		? "Verify your account using the code sent to your phone."
		: "Verify Account";

	const subtitle = mode === "phone"
		? `Enter the code we sent to +234 ${maskedContact}. It will be valid for 30 minutes.`
		: `Enter the 6-digit code sent to ${email}. It's valid for 30 minutes.`;

	return (
		<AuthLayout showBack showLogout onBack={onBack} step={1}>
			<div>
				<h1 className="text-3xl font-bold text-gray-900 mb-3">
					{title}
				</h1>
				<p className="text-gray-600 mb-8">
					{subtitle}
				</p>

				<div className="space-y-6">
					{/* OTP Input */}
					<div className="flex justify-center gap-3">
						{otp.map((digit, index) => (
							<React.Fragment key={index}>
								<input
									ref={(el) => { inputRefs.current[index] = el; }}
									type="text"
									inputMode="numeric"
									maxLength={1}
									value={digit}
									onChange={(e) => handleChange(index, e.target.value)}
									onKeyDown={(e) => handleKeyDown(index, e)}
									onPaste={handlePaste}
									className="w-14 h-16 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-white"
								/>
								{index === 2 && (
									<div className="flex items-center text-gray-400 text-xl">-</div>
								)}
							</React.Fragment>
						))}
					</div>

					{error && (
						<p className="text-red-500 text-sm text-center">{error}</p>
					)}

					{/* Resend Timer */}
					<div className="text-center">
						{resendCooldown > 0 ? (
							<p className="text-sm text-gray-500">
								Resend code in {resendCooldown}s
							</p>
						) : (
							<button
								onClick={handleResend}
								className="text-sm text-[#014834] font-medium hover:underline"
							>
								Resend code
							</button>
						)}
					</div>

					<Button
						onClick={handleSubmit}
						disabled={verifying}
						className="w-full bg-[#014834] text-white font-medium py-3 rounded-xl hover:bg-[#013628] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{verifying ? "Verifying..." : "Verify"}
					</Button>

					<div className="text-center space-y-2">
						<p className="text-sm text-gray-600">
							Didn&apos;t get a code? Check your messages
						</p>
						<button className="text-sm text-[#014834] font-medium hover:underline">
							Re-enter your phone number and try again
						</button>
					</div>
				</div>
			</div>
		</AuthLayout>
	);
};

export default VerifyOTP;
