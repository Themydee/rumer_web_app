"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import VerifyOTP from "@/app/signup/components/VerifyOTP";
import AuthLayout from "@/app/signup/components/AuthLayout";

const VerifyEmailContent = () => {
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";

	return (
		<AuthLayout showBack={false} step={1}>
			{email ? (
				<VerifyOTP email={email} mode="email" onVerified={() => (window.location.href = "/dashboard")} />
			) : (
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-3">
						Verify your email
					</h1>
					<p className="text-gray-600 mb-6">
						Please return to the signup screen and enter the 6-digit code we
						sent to your email.
					</p>
					<a
						href="/signup"
						className="text-[#014834] font-medium hover:underline"
					>
						Back to sign up
					</a>
				</div>
			)}
		</AuthLayout>
	);
};

const VerifyEmailPage = () => {
	return (
		<Suspense fallback={<div className="min-h-screen bg-white" />}>
			<VerifyEmailContent />
		</Suspense>
	);
};

export default VerifyEmailPage;
