"use client";
import React, { useState, useRef, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import AuthLayout from "@/app/signup/components/AuthLayout";
import { signIn, verifyEmail, resendVerificationCode, getToken } from "@/components/lib/supabase/auth";
import { authLogin } from "@/components/set-up/redux/children/auth";
import { toUserType } from "@/components/lib/user";
import { useAppDispatch } from "@/components/hooks";

type LoginStep = "login" | "verify";

const LoginPage = () => {
	const [step, setStep] = useState<LoginStep>("login");
	const [loginMode, setLoginMode] = useState<"email" | "phone">("email");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [apiError, setApiError] = useState("");
	const [verifyMode, setVerifyMode] = useState<"email" | "phone">("email");
	const [verifyContact, setVerifyContact] = useState("");

	const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
	const [otpError, setOtpError] = useState("");
	const [resendCooldown, setResendCooldown] = useState(30);
	const [verifying, setVerifying] = useState(false);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const dispatch = useAppDispatch();

	const hydrateUser = (result: { user?: any }) => {
		if (result.user) {
			dispatch(authLogin({ token: getToken() ?? "", user: toUserType(result.user) }));
		}
	};

	useEffect(() => {
		if (resendCooldown > 0) {
			const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [resendCooldown]);

	const handleLogin = async () => {
		setApiError("");
		if (loginMode === "email") {
			if (!email) { setApiError("Email is required"); return; }
			if (!password) { setApiError("Password is required"); return; }
			setIsSubmitting(true);
			try {
				const result = await signIn(email, password);
				if (result.success) {
					hydrateUser(result);
					window.location.href = "/dashboard";
				} else {
					setApiError(result.error || "Login failed");
				}
			} catch {
				setApiError("Something went wrong. Please try again.");
			} finally {
				setIsSubmitting(false);
			}
		} else {
			if (!phone || phone.length < 10) { setApiError("Valid phone number is required"); return; }
			if (!password) { setApiError("Password is required"); return; }
			setIsSubmitting(true);
			try {
				const result = await signIn(`+234${phone}@phone.rumer.local`, password);
				if (result.success) {
					hydrateUser(result);
					window.location.href = "/dashboard";
				} else {
					setApiError(result.error || "Login failed");
				}
			} catch {
				setApiError("Something went wrong. Please try again.");
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	const handleOtpChange = (index: number, value: string) => {
		if (value.length > 1) value = value.slice(-1);
		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);
		setOtpError("");
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handleOtpPaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
		const newOtp = [...otp];
		pasted.split("").forEach((char, i) => { if (i < 6) newOtp[i] = char; });
		setOtp(newOtp);
		if (pasted.length > 0) {
			inputRefs.current[Math.min(pasted.length, 5)]?.focus();
		}
	};

	const handleVerifyOtp = async () => {
		const code = otp.join("");
		if (code.length !== 6) { setOtpError("Please enter the complete 6-digit code"); return; }
		setVerifying(true);
		setOtpError("");
		if (verifyMode === "phone") {
			window.location.href = "/dashboard";
			return;
		}
		try {
			const result = await verifyEmail(code, verifyContact);
			if (result.success) {
				window.location.href = "/dashboard";
			} else {
				setOtpError(result.error || "Invalid code. Please try again.");
			}
		} catch {
			setOtpError("Something went wrong. Please try again.");
		} finally {
			setVerifying(false);
		}
	};

	const handleResend = async () => {
		if (resendCooldown > 0) return;
		if (verifyMode === "email") {
			try { await resendVerificationCode(verifyContact); } catch {}
		}
		setResendCooldown(30);
	};

	if (step === "verify") {
		const isEmail = verifyMode === "email";
		return (
			<AuthLayout showBack onBack={() => setStep("login")} step={1} showHeader={false} logo="/images/rumer-green-short.png">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-3 leading-snug">
						Enter the code sent to your {isEmail ? "email" : "phone"}
					</h1>
					<p className="text-gray-500 mb-8">
						{isEmail ? (
							<>We&apos;ve sent an email to <span className="font-medium text-gray-900">{verifyContact}</span> with a 6 digit code.</>
						) : (
							<>Please enter the code we&apos;ve sent to +234 {verifyContact}</>
						)}
					</p>

					<div className="space-y-6">
						<div className="flex gap-3">
							{otp.map((digit, index) => (
								<React.Fragment key={index}>
									<input
										ref={(el) => { inputRefs.current[index] = el; }}
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
								<button onClick={handleResend} className="text-sm text-[#014834] font-medium hover:underline">
									Resend code
								</button>
							)}
						</div>

						<button
							onClick={handleVerifyOtp}
							disabled={verifying}
							className="w-full py-4 rounded-2xl bg-[#014834] text-white text-base font-semibold hover:bg-[#013628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{verifying ? "Verifying..." : "Verify"}
						</button>

						<div className="space-y-1">
							<p className="text-sm font-semibold text-gray-900">Didn&apos;t get a code? Check your messages</p>
							<button
								onClick={() => { setStep("login"); setOtp(["","","","","",""]); setOtpError(""); }}
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

	return (
		<AuthLayout showBack={false} step={1} showHeader={false}>
			<div>
			<h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>

			{/* Email / Phone Tabs */}
				<div className="flex border border-gray-200 rounded-xl p-1 mb-6">
					<button
						onClick={() => { setLoginMode("email"); setApiError(""); }}
						className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
							loginMode === "email"
								? "bg-white text-gray-900 shadow-sm border border-gray-200"
								: "text-gray-500 hover:text-gray-700 border border-transparent"
						}`}
					>
						Email
					</button>
					<button
						onClick={() => { setLoginMode("phone"); setApiError(""); }}
						className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
							loginMode === "phone"
								? "bg-white text-gray-900 shadow-sm border border-gray-200"
								: "text-gray-500 hover:text-gray-700 border border-transparent"
						}`}
					>
						Phone
					</button>
				</div>

				<div className="space-y-4">
					{loginMode === "email" ? (
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

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
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
						<div className="flex justify-end mt-1">
							<a href="/forgot-password" className="text-sm text-[#014834] font-medium hover:underline">
								Forgot Password?
							</a>
						</div>
					</div>

					{apiError && (
						<div className="bg-red-50 border border-red-200 rounded-xl p-4">
							<p className="text-sm text-red-600">{apiError}</p>
						</div>
					)}

					<button
						onClick={handleLogin}
						disabled={isSubmitting}
						className="w-full py-4 rounded-2xl bg-[#014834] text-white text-base font-semibold hover:bg-[#013628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? "Logging in..." : "Log In"}
					</button>

					<p className="text-center text-sm text-gray-600 pt-2">
						Don&apos;t have an account?{" "}
						<a href="/signup" className="text-[#014834] font-bold hover:underline">
							Sign Up
						</a>
					</p>
				</div>
			</div>
		</AuthLayout>
	);
};

export default LoginPage;
