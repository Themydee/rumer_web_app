"use client";
import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import AuthLayout from "@/app/signup/components/AuthLayout";
import { forgotPassword } from "@/components/lib/supabase/auth";

type ForgotStep = "request" | "verify" | "new-password";

const ForgotPasswordPage = () => {
	const [step, setStep] = useState<ForgotStep>("request");
	const [mode, setMode] = useState<"email" | "phone">("email");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [apiError, setApiError] = useState("");
	const [successMsg, setSuccessMsg] = useState("");

	// OTP state
	const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
	const [otpError, setOtpError] = useState("");
	const [resendCooldown, setResendCooldown] = useState(30);
	const [verifying, setVerifying] = useState(false);

	// New password state
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [resetSuccess, setResetSuccess] = useState(false);

	React.useEffect(() => {
		if (resendCooldown > 0) {
			const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [resendCooldown]);

	const handleRequestReset = async () => {
		setApiError("");
		setSuccessMsg("");
		const contact = mode === "email" ? email : phone;
		if (!contact) {
			setApiError(mode === "email" ? "Email is required" : "Phone number is required");
			return;
		}
		setIsSubmitting(true);
		try {
			const result = await forgotPassword(mode === "email" ? email : `+234${phone}@phone.rumer.local`);
			if (result.success) {
				setSuccessMsg("If an account exists with this " + mode + ", a reset link/code has been sent.");
				setTimeout(() => setStep("verify"), 1500);
			} else {
				setApiError(result.error || "Failed to send reset code");
			}
		} catch {
			setApiError("Something went wrong. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOtpChange = (index: number, value: string) => {
		if (value.length > 1) value = value.slice(-1);
		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);
		setOtpError("");
	};

	const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			const prev = document.querySelector(`input[name="fp-otp-${index - 1}"]`) as HTMLInputElement;
			prev?.focus();
		}
	};

	const handleOtpPaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
		const newOtp = [...otp];
		pasted.split("").forEach((char, i) => { if (i < 6) newOtp[i] = char; });
		setOtp(newOtp);
	};

	const handleVerifyCode = () => {
		const code = otp.join("");
		if (code.length !== 6) { setOtpError("Please enter the complete 6-digit code"); return; }
		// Store the code and proceed to new-password step.
		// Actual verification happens server-side when resetPassword is called.
		setStep("new-password");
	};

	const handleResetPassword = async () => {
		setApiError("");
		if (newPassword.length < 8) { setApiError("Password must be at least 8 characters."); return; }
		if (newPassword !== confirmPassword) { setApiError("Passwords do not match."); return; }
		setIsSubmitting(true);
		try {
			const { resetPassword } = await import("@/components/lib/supabase/auth");
			const code = otp.join("");
			const contact = mode === "email" ? email : `+234${phone}@phone.rumer.local`;
			const result = await resetPassword(contact, code, newPassword);
			if (result.success) {
				setResetSuccess(true);
				setTimeout(() => { window.location.href = "/login"; }, 2000);
			} else {
				setApiError(result.error || "Failed to reset password");
			}
		} catch {
			setApiError("Something went wrong. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Step 3: Create new password
	if (step === "new-password") {
		return (
			<AuthLayout showBack onBack={() => setStep("verify")} step={1}>
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Password</h1>
					<p className="text-gray-500 mb-6">Enter your new password for your account.</p>

					<div className="space-y-5">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400 pr-12"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
								>
									{showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
								</button>
							</div>
							{newPassword.length > 0 && (
								<div className="mt-2 grid grid-cols-2 gap-2">
									<PasswordReq met={/[a-z]/.test(newPassword)} label="One lowercase character" />
									<PasswordReq met={/[0-9]/.test(newPassword)} label="One number" />
									<PasswordReq met={/[A-Z]/.test(newPassword)} label="One uppercase character" />
									<PasswordReq met={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)} label="One special character" />
									<PasswordReq met={newPassword.length >= 8} label="8 characters minimum" />
								</div>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Enter your Confirm Password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400 pr-12"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
								>
									{showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
								</button>
							</div>
							{confirmPassword.length > 0 && (
								<div className="mt-2 grid grid-cols-2 gap-2">
									<PasswordReq met={/[a-z]/.test(confirmPassword)} label="One lowercase character" />
									<PasswordReq met={/[0-9]/.test(confirmPassword)} label="One number" />
									<PasswordReq met={/[A-Z]/.test(confirmPassword)} label="One uppercase character" />
									<PasswordReq met={/[!@#$%^&*(),.?":{}|<>]/.test(confirmPassword)} label="One special character" />
									<PasswordReq met={confirmPassword.length >= 8} label="8 characters minimum" />
								</div>
							)}
						</div>

						{apiError && (
							<div className="bg-red-50 border border-red-200 rounded-xl p-4">
								<p className="text-sm text-red-600">{apiError}</p>
							</div>
						)}

						{resetSuccess && (
							<div className="bg-green-50 border border-green-200 rounded-xl p-4">
								<p className="text-sm text-green-600">Password reset successful! Redirecting to sign in...</p>
							</div>
						)}

						<button
							onClick={handleResetPassword}
							disabled={isSubmitting || resetSuccess}
							className="w-full py-4 rounded-2xl bg-[#014834] text-white text-base font-semibold hover:bg-[#013628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? "Resetting..." : resetSuccess ? "Done" : "Reset Password"}
						</button>
					</div>
				</div>
			</AuthLayout>
		);
	}

	// Step 2: Verify code
	if (step === "verify") {
		const isEmail = mode === "email";
		const contact = isEmail ? email : `+234 ${phone.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")}`;
		return (
			<AuthLayout showBack onBack={() => setStep("request")} step={1}>
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-3 leading-snug">
						Enter the code sent to your {isEmail ? "email" : "phone"}
					</h1>
					<p className="text-gray-500 mb-8">
						{isEmail ? (
							<>We&apos;ve sent an email to <span className="font-medium text-gray-900">{email}</span> with a 6 digit code.</>
						) : (
							<>Please enter the code we&apos;ve sent to +234 {phone}</>
						)}
					</p>

					<div className="space-y-6">
						<div className="flex gap-3">
							{otp.map((digit, index) => (
								<React.Fragment key={index}>
									<input
										type="text"
										inputMode="numeric"
										maxLength={1}
										value={digit}
										onChange={(e) => handleOtpChange(index, e.target.value)}
										onKeyDown={(e) => handleOtpKeyDown(index, e)}
										onPaste={handleOtpPaste}
										className="w-14 h-16 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-white"
									/>
									{index === 2 && <div className="flex items-center text-gray-400 text-xl">-</div>}
								</React.Fragment>
							))}
						</div>

						{otpError && <p className="text-red-500 text-sm">{otpError}</p>}

						<div>
							{resendCooldown > 0 ? (
								<p className="text-sm text-gray-500">Resend code in 00:{String(resendCooldown).padStart(2, "0")}</p>
							) : (
								<button onClick={() => { handleRequestReset(); }} className="text-sm text-[#014834] font-medium hover:underline">
									Resend code
								</button>
							)}
						</div>

						<button
							onClick={handleVerifyCode}
							disabled={verifying}
							className="w-full py-4 rounded-2xl bg-[#014834] text-white text-base font-semibold hover:bg-[#013628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{verifying ? "Verifying..." : "Verify"}
						</button>

						<div className="space-y-1">
							<p className="text-sm font-semibold text-gray-900">Didn&apos;t get a code? Check your messages</p>
							<button
								onClick={() => { setStep("request"); setOtp(["","","","","",""]); setOtpError(""); }}
								className="text-sm text-[#014834] font-medium hover:underline"
							>
								Re-enter your {isEmail ? "email" : "phone number"} and try again
							</button>
						</div>
					</div>
				</div>
			</AuthLayout>
		);
	}

	// Step 1: Request reset
	return (
		<AuthLayout showBack onBack={() => window.location.href = "/login"} step={1}>
			<div>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Reset your password</h1>
				<p className="text-gray-500 mb-6">Enter your personal data to reset your password account.</p>

				<div className="flex bg-gray-100 rounded-xl p-1 mb-6">
					<button
						onClick={() => { setMode("email"); setApiError(""); setSuccessMsg(""); }}
						className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
							mode === "email"
								? "bg-white text-gray-900 shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Email
					</button>
					<button
						onClick={() => { setMode("phone"); setApiError(""); setSuccessMsg(""); }}
						className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
							mode === "phone"
								? "bg-white text-gray-900 shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Phone Number
					</button>
				</div>

				<div className="space-y-4">
					{mode === "email" ? (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
							<input
								type="email"
								placeholder="eg. johnfrans@gmail.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400"
							/>
						</div>
					) : (
						<div>
							<label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
								Phone Number
								<span className="text-[#014834] text-xs cursor-pointer flex items-center gap-1">
									Why
									<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</span>
							</label>
							<div className="flex items-center border border-gray-250 rounded-xl overflow-hidden bg-gray-50 focus-within:ring-2 focus-within:ring-[#014834] focus-within:border-transparent">
								<div className="flex items-center gap-2 px-4 py-3 border-r border-gray-200 bg-white">
									<div className="w-5 h-3 bg-green-600 rounded-sm" />
									<select className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer">
										<option value="+234">+234</option>
									</select>
								</div>
								<input
									type="tel"
									placeholder="8200280497"
									value={phone}
									onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
									className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-gray-900 placeholder-gray-400"
								/>
								{phone.length >= 10 && (
									<div className="px-3">
										<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
									</div>
								)}
							</div>
						</div>
					)}

					<p className="text-sm text-gray-500">
						If an account exists with this {mode}, a reset link/code has been sent.
					</p>

					{apiError && (
						<div className="bg-red-50 border border-red-200 rounded-xl p-4">
							<p className="text-sm text-red-600">{apiError}</p>
						</div>
					)}

					{successMsg && (
						<div className="bg-green-50 border border-green-200 rounded-xl p-4">
							<p className="text-sm text-green-600">{successMsg}</p>
						</div>
					)}

					<button
						onClick={handleRequestReset}
						disabled={isSubmitting}
						className="w-full py-4 rounded-2xl bg-[#014834] text-white text-base font-semibold hover:bg-[#013628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? "Sending..." : "Reset Password"}
					</button>
				</div>
			</div>
		</AuthLayout>
	);
};

const PasswordReq = ({ met, label }: { met: boolean; label: string }) => (
	<div className="flex items-center gap-2">
		<div className={`w-5 h-5 rounded-full flex items-center justify-center ${met ? "bg-green-500" : "bg-gray-200"}`}>
			{met && (
				<svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
				</svg>
			)}
		</div>
		<span className={`text-sm ${met ? "text-green-600" : "text-gray-500"}`}>{label}</span>
	</div>
);

export default ForgotPasswordPage;
