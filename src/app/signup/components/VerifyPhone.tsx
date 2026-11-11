"use client";
import React, { useState } from "react";
import { Button } from "@heroui/react";
import AuthLayout from "./AuthLayout";

interface VerifyPhoneProps {
	onVerify: (phone: string) => void;
	onError: () => void;
	onBack?: () => void;
}

const VerifyPhone = ({ onVerify, onError, onBack }: VerifyPhoneProps) => {
	const [phone, setPhone] = useState("");
	const [error, setError] = useState("");
	const [countryCode, setCountryCode] = useState("+234");

	const handleSubmit = () => {
		if (!phone) {
			setError("Phone number is required");
			return;
		}
		if (phone.length < 10) {
			setError("Please enter a valid phone number");
			return;
		}
		setError("");

		// Simulate error for demo
		if (phone === "8012345678") {
			onError();
		} else {
			onVerify(`${countryCode}${phone}`);
		}
	};

	return (
		<AuthLayout showBack onBack={onBack} step={1}>
			<div>
				<h1 className="text-3xl font-bold text-gray-900 mb-3">
					Verify your account using the code sent to your phone.
				</h1>
				<p className="text-gray-600 mb-8">
					Enter the code we sent to {countryCode} {phone || "0000000000"}. It will be
					valid for 30 minutes.
				</p>

				<div className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Phone Number
						</label>
						<div className="flex items-center border border-gray-250 rounded-xl overflow-hidden bg-gray-50 focus-within:ring-2 focus-within:ring-[#014834] focus-within:border-transparent">
							<div className="flex items-center gap-2 px-4 py-3 border-r border-gray-200 bg-white">
								<div className="w-5 h-3 bg-green-600 rounded-sm" />
								<select
									value={countryCode}
									onChange={(e) => setCountryCode(e.target.value)}
									className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
								>
									<option value="+234">+234</option>
									<option value="+233">+233</option>
									<option value="+254">+254</option>
								</select>
							</div>
							<input
								type="tel"
								placeholder="8200 280 497"
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
						{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
					</div>

					<Button
						onClick={handleSubmit}
						className="w-full bg-[#014834] text-white font-medium py-3 rounded-xl hover:bg-[#013628] transition-colors"
					>
						Send Verification Code
					</Button>

					<div className="text-center">
						<p className="text-sm text-gray-600">
							Didn&apos;t get a code? Check your messages
						</p>
						<button className="text-sm text-[#014834] font-medium hover:underline mt-2">
							Re-enter your phone number and try again
						</button>
					</div>
				</div>
			</div>
		</AuthLayout>
	);
};

export default VerifyPhone;
