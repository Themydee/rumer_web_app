"use client";

import React from "react";
import { ArrowRight, Check } from "lucide-react";
import Picture from "@/components/reusables/Picture";
import { gridPattern } from "../../../../public"; // Assuming this path based on other components
import { RumerBadge } from "@/components/utils/functions";

const ContactHeroSection = () => {
	return (
		<section className='relative w-full bg-white md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 lg:pt-20'>
			{/* Grid Pattern Background */}
			<div className='absolute inset-0 pointer-events-none'>
				<Picture
					src={gridPattern}
					className='absolute top-0 left-0 w-full h-full object-cover opacity-30'
					alt=''
				/>
			</div>

			<div className='max-w-7xl mx-auto relative z-10'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start'>
					{/* Left Column: Content */}
					<div className='pt-20 lg:pt-16 xl:pt-20 space-y-2 lg:space-y-4 flex flex-col justify-center items-center sm:items-start'>
						{/* Pill Badge */}
						<RumerBadge title='Contact Us' className='w-fit' />

						<h1 className='text-5xl md:text-6xl xl:text-7xl font-normal text-center sm:text-start text-black-100 tracking-tight leading-[1.1]'>
							We’re always available to answer your questions
						</h1>

						<p className='text-base sm:text-lg md:text-xl lg:text-2xl text-center sm:text-start font-inter font-light text-black-200 max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed'>
							Get behind the scenes on our process, exciting news, and the
							people making dreams come true for millions of businesses.
						</p>

						{/* Features List */}

						<div className='flex justify-center sm:justify-start flex-wrap gap-4 mb-8 font-inter'>
							{["Traceability", "Ecosystem", "Protected and Secured"].map(
								(item, index) => (
									<div key={index} className='flex items-center gap-2'>
										<div className='w-6 h-6 rounded-full bg-green_1-100 flex items-center justify-center'>
											<Check
												className='w-3.5 h-3.5 text-white'
												strokeWidth={3}
											/>
										</div>
										<span className='text-black-100 font-medium'>{item}</span>
									</div>
								),
							)}
						</div>
					</div>

					{/* Right Column: Form */}
					<div className='w-full'>
						<form className='flex flex-col gap-6 lg:mt-16 xl:mt-20'>
							{/* Row 1: Name */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div className='flex flex-col gap-2'>
									<label
										htmlFor='firstName'
										className='text-sm font-medium text-black-100'
									>
										First Name
									</label>
									<input
										type='text'
										id='firstName'
										placeholder='eg. John'
										className='w-full px-4 py-3 bg-gray-800 rounded-lg text-black-100 placeholder:text-gray-900/40 focus:outline-none focus:ring-2 focus:ring-yellowVB-500 transition-all'
									/>
								</div>
								<div className='flex flex-col gap-2'>
									<label
										htmlFor='lastName'
										className='text-sm font-medium text-black-100'
									>
										Last Name
									</label>
									<input
										type='text'
										id='lastName'
										placeholder='eg. Francisco'
										className='w-full px-4 py-3 bg-gray-800 rounded-lg text-black-100 placeholder:text-gray-900/40 focus:outline-none focus:ring-2 focus:ring-yellowVB-500 transition-all'
									/>
								</div>
							</div>

							{/* Email */}
							<div className='flex flex-col gap-2'>
								<label
									htmlFor='email'
									className='text-sm font-medium text-black-100'
								>
									Email
								</label>
								<input
									type='email'
									id='email'
									placeholder='eg. johnfrans@gmail.com'
									className='w-full px-4 py-3 bg-gray-800 rounded-lg text-black-100 placeholder:text-gray-900/40 focus:outline-none focus:ring-2 focus:ring-yellowVB-500 transition-all'
								/>
							</div>

							{/* Phone Number */}
							<div className='flex flex-col gap-2'>
								<label
									htmlFor='phone'
									className='text-sm font-medium text-black-100'
								>
									Phone Number
								</label>
								<input
									type='tel'
									id='phone'
									placeholder='Enter Phone Number'
									className='w-full px-4 py-3 bg-gray-800 rounded-lg text-black-100 placeholder:text-gray-900/40 focus:outline-none focus:ring-2 focus:ring-yellowVB-500 transition-all'
								/>
							</div>

							{/* Message */}
							<div className='flex flex-col gap-2'>
								<label
									htmlFor='message'
									className='text-sm font-medium text-black-100'
								>
									How can we help you?
								</label>
								<textarea
									id='message'
									rows={4}
									placeholder='Enter How can we help you?'
									className='w-full px-4 py-3 bg-gray-800 rounded-lg text-black-100 placeholder:text-gray-900/40 focus:outline-none focus:ring-2 focus:ring-yellowVB-500 transition-all resize-none'
								></textarea>
							</div>

							{/* Submit Button */}
							<button
								type='submit'
								className='w-full bg-vcjointherummer-200 text-black-100 font-medium py-3 lg:py-4 rounded-lg hover:bg-vcjointherummer-200/80 transition-colors duration-300 mt-2'
							>
								Submit
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ContactHeroSection;
