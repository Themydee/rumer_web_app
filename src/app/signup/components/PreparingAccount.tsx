"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import AuthLayout from "./AuthLayout";

const PreparingAccount = () => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(interval);
					return 100;
				}
				return prev + 5;
			});
		}, 100);

		return () => clearInterval(interval);
	}, []);

	return (
		<AuthLayout showBack={false} step={3}>
			<div className="text-center">
				<h1 className="text-3xl font-bold text-gray-900 mb-3">
					Getting your Account Prepared
				</h1>
				<p className="text-gray-600 mb-8">This will only take a moment...</p>

				<div className="space-y-4">
					{/* Progress Bar */}
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-[#014834] h-2 rounded-full transition-all duration-300"
							style={{ width: `${progress}%` }}
						/>
					</div>

					<p className="text-sm text-gray-600">{progress}% Complete</p>

					{progress === 100 && (
						<div className="mt-6">
							<p className="text-green-600 font-medium mb-4">
								Account created successfully!
							</p>
							<Button
								onClick={() => (window.location.href = "/dashboard")}
								className="w-full bg-[#014834] text-white font-medium py-3 rounded-xl hover:bg-[#013628] transition-colors"
							>
								Go to Dashboard
							</Button>
						</div>
					)}
				</div>
			</div>
		</AuthLayout>
	);
};

export default PreparingAccount;
