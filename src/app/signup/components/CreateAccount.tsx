"use client";
import React, { useState, useMemo } from "react";
import { Button } from "@heroui/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { signUp } from "@/components/lib/supabase/auth";

interface CreateAccountProps {
	onSubmit: (email: string, password: string, firstName: string, lastName: string) => void;
	onError: () => void;
	onBack?: () => void;
}

const CreateAccount = ({ onSubmit, onError, onBack }: CreateAccountProps) => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [agreed, setAgreed] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [apiError, setApiError] = useState("");
	const [errors, setErrors] = useState<{
		firstName?: string;
		lastName?: string;
		phone?: string;
		email?: string;
		password?: string;
		agreed?: string;
	}>({});

	const validateEmail = (email: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	const passwordValidation = useMemo(() => {
		return {
			hasLowercase: /[a-z]/.test(password),
			hasUppercase: /[A-Z]/.test(password),
			hasNumber: /[0-9]/.test(password),
			hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
			hasMinLength: password.length >= 8,
		};
	}, [password]);

	const isPasswordValid = useMemo(() => {
		return (
			passwordValidation.hasLowercase &&
			passwordValidation.hasUppercase &&
			passwordValidation.hasNumber &&
			passwordValidation.hasSpecial &&
			passwordValidation.hasMinLength
		);
	}, [passwordValidation]);

	const handleSubmit = async () => {
		const newErrors: typeof errors = {};

		if (!firstName.trim()) newErrors.firstName = "First name is required";
		if (!lastName.trim()) newErrors.lastName = "Last name is required";
		if (!phone) newErrors.phone = "Phone number is required";
		else if (phone.length < 10) newErrors.phone = "Please enter a valid phone number";

		if (!email) {
			newErrors.email = "Email is required";
		} else if (!validateEmail(email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!password) {
			newErrors.password = "Password is required";
		} else if (!isPasswordValid) {
			newErrors.password = "Password does not meet requirements";
		}

		if (!agreed) {
			newErrors.agreed = "You must agree to the terms";
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			setIsSubmitting(true);
			setApiError("");

			try {
				const result = await signUp(
					email,
					password,
					firstName,
					lastName,
					`+234${phone}`
				);

				if (result.success) {
					onSubmit(email, password, firstName, lastName);
				} else {
					setApiError(
						result.error === "Email already registered"
							? "This email is already registered. Please sign in instead."
							: result.error || "Failed to create account. Please try again."
					);
					onError();
				}
			} catch (error) {
				setApiError("Something went wrong. Please try again.");
				onError();
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	const PasswordRequirement = ({ met, label }: { met: boolean; label: string }) => (
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

	return (
		<AuthLayout showBack onBack={onBack} step={1}>
			<div>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Create Rumer account</h1>
				<p className="text-gray-600 mb-8">Enter your personal data to create your account.</p>

				<div className="space-y-5">
					{/* Name Fields */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								First Name
							</label>
							<input
								type="text"
								placeholder="eg. John"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								className={`w-full px-4 py-3 rounded-xl border ${
									errors.firstName ? "border-red-500" : "border-gray-250"
								} focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400`}
							/>
							{errors.firstName && (
								<p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
							)}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								Last Name
							</label>
							<input
								type="text"
								placeholder="eg. Francisco"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								className={`w-full px-4 py-3 rounded-xl border ${
									errors.lastName ? "border-red-500" : "border-gray-250"
								} focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400`}
							/>
							{errors.lastName && (
								<p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
							)}
						</div>
					</div>

					{/* Phone Number */}
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
							<div className="flex items-center gap-2 px-4 py-3 border-r border-gray-250 bg-white">
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
						{errors.phone && (
							<p className="text-red-500 text-xs mt-1">{errors.phone}</p>
						)}
					</div>

					{/* Email */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Email
						</label>
						<input
							type="email"
							placeholder="eg. johnfrans@gmail.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={`w-full px-4 py-3 rounded-xl border ${
								errors.email ? "border-red-500" : "border-gray-250"
							} focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400`}
						/>
						{errors.email && (
							<p className="text-red-500 text-xs mt-1">{errors.email}</p>
						)}
					</div>

					{/* Password */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className={`w-full px-4 py-3 rounded-xl border ${
									errors.password ? "border-red-500" : "border-gray-250"
								} focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent bg-gray-50 placeholder-gray-400 pr-12`}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{showPassword ? (
									<EyeOffIcon className="w-5 h-5" />
								) : (
									<EyeIcon className="w-5 h-5" />
								)}
							</button>
						</div>

						{/* Password Validation Indicators */}
						{password.length > 0 && (
							<div className="mt-3 grid grid-cols-2 gap-2">
								<PasswordRequirement met={passwordValidation.hasLowercase} label="One lowercase character" />
								<PasswordRequirement met={passwordValidation.hasNumber} label="One number" />
								<PasswordRequirement met={passwordValidation.hasUppercase} label="One uppercase character" />
								<PasswordRequirement met={passwordValidation.hasSpecial} label="One special character" />
								<PasswordRequirement met={passwordValidation.hasMinLength} label="8 characters minimum" />
							</div>
						)}

						{password.length === 0 && (
							<p className="text-xs text-gray-500 mt-1">
								Must be at least 8 characters.
							</p>
						)}

						{errors.password && (
							<p className="text-red-500 text-xs mt-1">{errors.password}</p>
						)}
					</div>

					{/* Terms Agreement */}
					<div className="flex items-start gap-3">
						<input
							type="checkbox"
							checked={agreed}
							onChange={(e) => setAgreed(e.target.checked)}
							className="mt-1 w-4 h-4 text-[#014834] border-gray-300 rounded focus:ring-[#014834]"
						/>
						<p className="text-sm text-gray-600">
							By proceeding, you agree to our{" "}
							<a href="#" className="text-[#014834] hover:underline">Terms of Service</a>, our{" "}
							<a href="#" className="text-[#014834] hover:underline">Merchant Terms of Service</a>{" "}
							and that you have read and understood our{" "}
							<a href="#" className="text-[#014834] hover:underline">Privacy Policy</a>.
						</p>
					</div>
					{errors.agreed && (
						<p className="text-red-500 text-xs">{errors.agreed}</p>
					)}

					{/* Submit Button */}
					{apiError && (
						<div className="bg-red-50 border border-red-200 rounded-xl p-4">
							<p className="text-sm text-red-600">{apiError}</p>
						</div>
					)}
					<Button
						onClick={handleSubmit}
						disabled={isSubmitting}
						className="w-full bg-[#014834] text-white font-medium py-3 rounded-xl hover:bg-[#013628] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? "Creating Account..." : "Sign Up"}
					</Button>

					<p className="text-center text-sm text-gray-600">
						Already have an account?{" "}
						<a href="/login" className="text-[#014834] font-bold hover:underline">
							Log in
						</a>
					</p>
				</div>
			</div>
		</AuthLayout>
	);
};

export default CreateAccount;
