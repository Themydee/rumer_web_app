"use client";
import React from "react";
import { Button } from "@heroui/react";
import AuthLayout from "./AuthLayout";

interface SignupErrorProps {
	type: "email-exists" | "phone-exists";
	onRetry: () => void;
	onGoHome: () => void;
}

const SignupError = ({ type, onRetry, onGoHome }: SignupErrorProps) => {
	const getErrorMessage = () => {
		switch (type) {
			case "email-exists":
				return {
					title: "Email Already in Use",
					message:
						"This email address is already registered. Please use a different email or sign in to your existing account.",
				};
			case "phone-exists":
				return {
					title: "Phone Number Already Registered",
					message:
						"This phone number is already associated with an account. Please use a different number or sign in.",
				};
			default:
				return {
					title: "Error",
					message: "An error occurred. Please try again.",
				};
		}
	};

	const error = getErrorMessage();

	return (
		<AuthLayout showBack={false} step={1}>
			<div className="text-center">
				<div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
					<svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>

				<h1 className="text-3xl font-bold text-gray-900 mb-3">{error.title}</h1>
				<p className="text-gray-600 mb-8">{error.message}</p>

				<div className="space-y-3">
					<Button
						onClick={onRetry}
						className="w-full bg-[#014834] text-white font-medium py-3 rounded-xl hover:bg-[#013628] transition-colors"
					>
						Try Again
					</Button>

					<Button
						onClick={onGoHome}
						className="w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-200 transition-colors"
					>
						Go to Home
					</Button>
				</div>
			</div>
		</AuthLayout>
	);
};

export default SignupError;
