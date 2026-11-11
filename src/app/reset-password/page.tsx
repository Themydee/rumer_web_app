"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";
import AuthLayout from "@/app/signup/components/AuthLayout";
import { resetPassword } from "@/components/lib/supabase/auth";

const ResetPasswordContent = () => {
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";

	const [code, setCode] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (success) {
			const t = setTimeout(() => (window.location.href = "/login"), 2000);
			return () => clearTimeout(t);
		}
	}, [success]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!email) {
			setError("Missing email. Please restart the password reset flow.");
			return;
		}
		if (code.length !== 6) {
			setError("Please enter the 6-digit code from your email.");
			return;
		}
		if (password.length < 8) {
			setError("Password must be at least 8 characters.");
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setSubmitting(true);
		try {
			const result = await resetPassword(email, code, password);
			if (result.success) {
				setSuccess(true);
			} else {
				setError(result.error || "Failed to reset password.");
			}
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<AuthLayout showBack={false} step={1}>
			<div>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Reset password</h1>
				<p className="text-gray-600 mb-8">
					Enter the 6-digit code we sent to{" "}
					<span className="font-medium text-gray-900">{email || "your email"}</span>{" "}
					and choose a new password.
				</p>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Verification Code
						</label>
						<input
							type="text"
							inputMode="numeric"
							maxLength={6}
							placeholder="123456"
							value={code}
							onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
							className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] bg-gray-50 placeholder-gray-400"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							New Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Enter your new password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] bg-gray-50 placeholder-gray-400 pr-12"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
							>
								{showPassword ? "Hide" : "Show"}
							</button>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Confirm New Password
						</label>
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Confirm your new password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] bg-gray-50 placeholder-gray-400"
						/>
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 rounded-xl p-4">
							<p className="text-sm text-red-600">{error}</p>
						</div>
					)}

					{success && (
						<div className="bg-green-50 border border-green-200 rounded-xl p-4">
							<p className="text-sm text-green-600">
								Password reset successful! Redirecting to sign in...
							</p>
						</div>
					)}

					<Button
						type="submit"
						disabled={submitting || success}
						className="w-full bg-[#014834] text-white font-medium py-3 rounded-xl hover:bg-[#013628] transition-colors disabled:opacity-50"
					>
						{submitting ? "Resetting..." : success ? "Done" : "Reset Password"}
					</Button>

					{success && (
						<a
							href="/login"
							className="block text-center text-sm text-[#014834] font-medium hover:underline"
						>
							Go to sign in
						</a>
					)}
				</form>
			</div>
		</AuthLayout>
	);
};

const ResetPasswordPage = () => {
	return (
		<Suspense fallback={<div className="min-h-screen bg-white" />}>
			<ResetPasswordContent />
		</Suspense>
	);
};

export default ResetPasswordPage;
