"use client";
import React from "react";

interface AuthLayoutProps {
	children: React.ReactNode;
	showBack?: boolean;
	showLogout?: boolean;
	showHeader?: boolean;
	onBack?: () => void;
	onLogout?: () => void;
	step?: number;
	variant?: "signup" | "profile-completion";
	logo?: string;
}

const signupSteps = [
	{ num: 1, label: "Sign up your account" },
	{ num: 2, label: "Set up your business account" },
	{ num: 3, label: "Verify your personal details" },
];

const profileCompletionSteps = [
	{ num: 1, label: "Sign up your account" },
	{ num: 2, label: "Set up your business account" },
	{ num: 3, label: "Verify your personal details" },
];

const AuthLayout = ({
	children,
	showBack = true,
	showLogout = false,
	showHeader = true,
	onBack,
	onLogout,
	step = 1,
	variant = "signup",
	logo = "/images/rummer-logo-2.png",
}: AuthLayoutProps) => {
	const sidebarSteps = variant === "signup" ? signupSteps : profileCompletionSteps;
	const stepLabel = step === 1 ? "1/3" : step === 2 ? "2/3" : "3/3";

	return (
		<div className="min-h-screen flex flex-col lg:flex-row">
			{/* Hero Section */}
			<div
				className="relative h-64 lg:h-auto lg:w-1/2 bg-cover bg-center flex-shrink-0"
				style={{ backgroundImage: "url('/home/cow-image.jpg')" }}
			>
				<div className="absolute inset-0">
					<div className="absolute inset-0 bg-black/40 lg:bg-black/80" />
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
				</div>

				{/* Logo */}
				<div className="absolute top-6 left-6 z-10">
					{logo ? (
						<img src={logo} alt="Rumer" className="h-10 w-auto" />
					) : (
						<div className="flex items-center gap-2">
							<div className="w-10 h-10 bg-[#014834] rounded-full flex items-center justify-center">
								<span className="text-white text-xl font-bold">R</span>
							</div>
							<span className="text-white text-2xl font-bold">Rumer</span>
						</div>
					)}
				</div>

				{/* Country Selector */}
				<div className="absolute top-6 right-6 z-10">
					<div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
						<div className="w-5 h-3 bg-green-600 rounded-sm" />
						<span className="text-white text-sm font-medium">NG</span>
						<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</div>

				{/* Desktop Content */}
				<div className="hidden lg:block absolute bottom-16 left-8 right-8 z-10">
					<h2 className="text-white text-4xl font-bold mb-4">Get Started with Us</h2>
					<p className="text-white/80 text-lg mb-8">
						Complete these easy steps to register your account.
					</p>

					{/* Steps */}
					<div className="space-y-3 max-w-sm">
						{sidebarSteps.map((s) => (
							<div
								key={s.num}
								className={`flex items-center gap-4 px-4 py-3 rounded-xl ${
									s.num === step
										? "bg-white"
										: "bg-white/10 backdrop-blur-sm"
								}`}
							>
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
										s.num === step
											? "bg-[#014834] text-white"
											: "bg-white/20 text-white"
									}`}
								>
									{s.num}
								</div>
								<span
									className={`font-medium ${
										s.num === step ? "text-[#014834]" : "text-white"
									}`}
								>
									{s.label}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Form Section */}
			<div className="relative lg:w-1/2 flex flex-col bg-white lg:bg-white">
				{/* Mobile Logo Badge */}
				<div className="lg:hidden flex justify-center -mt-8 relative z-20">
					<div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-white">
						<img src="/images/rumer-green-short.png" alt="Rumer" className="h-10 w-auto" />
					</div>
				</div>

				{/* Form Card */}
				<div className="flex-1 flex flex-col bg-white rounded-t-3xl lg:rounded-none -mt-4 lg:mt-0 relative z-10">
					{/* Header with progress */}
					{showHeader && (
						<div className="px-8 pt-6 pb-4">
							<div className="flex items-center justify-between mb-3">
								<h2 className="text-xl font-bold text-gray-900">Account set up</h2>
								<span className="text-sm font-medium text-gray-500">{stepLabel}</span>
							</div>
							{/* Progress bar */}
							<div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
								<div
									className="h-full bg-[#014834] rounded-full transition-all duration-500"
									style={{ width: step === 1 ? "33.33%" : step === 2 ? "66.66%" : "100%" }}
								/>
							</div>
						</div>
					)}

					{/* Back link */}
					{showBack && onBack && (
						<div className="px-8 pb-2">
							<button
								onClick={onBack}
								className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
								</svg>
								Back
							</button>
						</div>
					)}

					{/* Form Content */}
					<div className="flex-1 flex items-start justify-center px-8 lg:px-16 pt-4 pb-8 overflow-y-auto">
						<div className="w-full max-w-md">{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthLayout;
