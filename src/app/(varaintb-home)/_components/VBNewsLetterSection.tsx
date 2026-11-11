"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Inter } from "next/font/google";

const inter = Inter({
	subsets: ["latin-ext"],
	weight: ["300", "400", "500", "700"],
	style: ["normal"],
});

const VBNewsLetterSection = () => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !email.includes("@")) {
			toast.error("Please enter a valid email address");
			return;
		}

		setIsLoading(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1200));

		toast.success("Thank you! You're now subscribed.");
		setEmail("");
		setIsLoading(false);
	};

	return (
		<section
			className={`py-8 sm:py-12 lg:py-24 font-sf-pro bg-white w-full max-w-7xl mx-auto ${inter.className}`}
		>
			<div className='w-full px-4 flex flex-col items-start gap-8'>
				<div className='space-y-4 max-w-4xl'>
					<h2 className='text-3xl sm:text-4xl lg:text-5xl font-medium text-black-100 leading-tight'>
						Get real insights from the field, not just headlines.
					</h2>
					<p className='text-base sm:text-lg text-black-300'>
						Real data, minus the noise
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className='flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full sm:w-auto'
				>
					<div className='relative w-full sm:w-[320px] lg:w-[400px]'>
						<label htmlFor='email' className='sr-only'>
							Email
						</label>
						<input
							id='email'
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='Enter Email Address'
							className='w-full px-4 sm:px-6 py-3.5 bg-black-100/10 text-black-100 placeholder-gray-500 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all font-medium text-sm sm:text-base'
							required
						/>
					</div>

					<button
						type='submit'
						disabled={isLoading}
						className='inline-flex items-center justify-center bg-secondary-100 hover:bg-yellow-500 text-black-100 font-medium px-8 py-3.5 rounded-[10px] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto whitespace-nowrap'
					>
						{isLoading ? "Signing Up..." : "Sign Up"}
					</button>
				</form>
			</div>
		</section>
	);
};

export default VBNewsLetterSection;
