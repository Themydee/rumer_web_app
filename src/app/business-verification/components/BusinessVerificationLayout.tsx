"use client";
import React from "react";

interface BusinessVerificationLayoutProps {
	children: React.ReactNode;
	step: number;
	total: number;
	onBack?: () => void;
	showBack?: boolean;
}

const BusinessVerificationLayout = ({
	children,
	step,
	total,
	onBack,
	showBack = true,
}: BusinessVerificationLayoutProps) => {
	const percent = Math.round((step / total) * 100);
	const stepLabel = `${step}/${total}`;

	return (
		<div className="min-h-screen flex">
			{/* Left side - Hero Image */}
			<div
				className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
				style={{ backgroundImage: "url('/images/auth-hero.jpg')" }}
			>
				<div className="absolute inset-0">
					<div className="absolute inset-0 bg-black/80" />
					<div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
				</div>

				<div className="absolute top-8 left-8 z-10">
					<div className="flex items-center gap-2">
						<div className="w-10 h-10 bg-[#014834] rounded-full flex items-center justify-center">
							<span className="text-white text-xl font-bold">R</span>
						</div>
						<span className="text-white text-2xl font-bold">Rumer</span>
					</div>
				</div>

				<div className="absolute top-8 right-8 z-10">
					<div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
						<div className="w-5 h-3 bg-green-600 rounded-sm" />
						<span className="text-white text-sm font-medium">NG</span>
					</div>
				</div>

				<div className="absolute bottom-16 left-8 right-8 z-10">
					<h2 className="text-white text-4xl font-bold mb-4">
						Business Verification
					</h2>
					<p className="text-white/80 text-lg mb-8">
						Complete these steps to verify your registered business and unlock
						all platform features.
					</p>
					<div className="space-y-3 max-w-sm">
						{Array.from({ length: total }).map((_, i) => {
							const num = i + 1;
							return (
								<div
									key={num}
									className={`flex items-center gap-4 px-4 py-3 rounded-xl ${
										num === step
											? "bg-white"
											: "bg-white/10 backdrop-blur-sm"
									}`}
								>
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
											num === step
												? "bg-[#014834] text-white"
												: num < step
												? "bg-green-600 text-white"
												: "bg-white/20 text-white"
										}`}
									>
										{num < step ? "✓" : num}
									</div>
									<span
										className={`font-medium ${
											num === step ? "text-[#014834]" : "text-white"
										}`}
									>
										Step {num}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Right side - Form */}
			<div className="w-full lg:w-1/2 flex flex-col bg-white">
				<div className="px-8 pt-6 pb-4">
					<div className="flex items-center justify-between mb-3">
						<h2 className="text-xl font-bold text-gray-900">
							Business Verification
						</h2>
						<span className="text-sm font-medium text-gray-500">
							{stepLabel}
						</span>
					</div>
					<div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
						<div
							className="h-full bg-[#014834] rounded-full transition-all duration-500"
							style={{ width: `${percent}%` }}
						/>
					</div>
				</div>

				{showBack && onBack && (
					<div className="px-8 pb-2">
						<button
							onClick={onBack}
							className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							Back
						</button>
					</div>
				)}

				<div className="flex-1 flex items-start justify-center px-8 lg:px-16 pt-4 pb-8 overflow-y-auto">
					<div className="w-full max-w-md">{children}</div>
				</div>
			</div>
		</div>
	);
};

export default BusinessVerificationLayout;
