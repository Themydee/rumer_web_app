"use client";

import React from "react";
import {
	MapPin,
	Mail,
	Phone,
	Facebook,
	Linkedin,
	Instagram,
	Twitter,
} from "lucide-react";
import Picture from "@/components/reusables/Picture";
import { worldImg } from "../../../../public"; // Importing worldImg
import { FaXTwitter } from "react-icons/fa6";

const ConnectWithUs = () => {
	return (
		<section className='w-full bg-white py-16 md:px-4 sm:px-6 lg:px-8 lg:pb-20'>
			<div className='max-w-7xl mx-auto'>
				<div className='relative w-full bg-primary-200 md:rounded-[32px] overflow-hidden px-5 py-8 md:p-12 lg:p-16 min-h-[500px] flex items-center'>
					<div className='absolute right-0 top-0 h-full w-full sm:w-1/3 xl:w-2/3 pointer-events-none hidden md:block'>
						<Picture
							src={worldImg}
							className='absolute z-20 top-1/2 -translate-y-1/2 right-0 h-[100%] md:h-[120%] w-auto object-contain md:object-cover'
							alt='World Map'
						/>
					</div>

					{/* <div className="absolute inset-0 bg-gradient-to-r from-[#004D33] via-[#004D33] to-transparent pointer-events-none md:hidden" /> */}

					<div className='relative z-10 flex flex-col gap-8 max-w-xl'>
						<div className='flex flex-col gap-4'>
							<span className='text-yellowVB-300 font-medium text-sm md:text-base tracking-wide uppercase'>
								Connect with Us
							</span>
							<h2 className='text-2xl sm:text-4xl md:text-5xl font-normal text-white leading-[50px] md:leading-[70px]'>
								Want to meet the team? Come say hello.
							</h2>
						</div>

						<div className='w-full h-px bg-white/10 lg:my-4' />

						<div className='flex items-center gap-3 mb-4'>
							<div className='w-6 h-6 rounded-full overflow-hidden border border-white/20 relative flex bg-white'>
								<div className='w-1/3 h-full bg-green_1-300'></div>
								<div className='w-1/3 h-full bg-white'></div>
								<div className='w-1/3 h-full bg-green_1-300'></div>
							</div>
							<h3 className='text-white text-lg font-medium'>Nigeria</h3>
						</div>

						<div className='flex flex-col gap-6 font-inter'>
							<div className='flex items-start gap-4'>
								<div className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10'>
									<MapPin className='w-5 h-5 text-yellowVB-100' />
								</div>
								<p className='text-white/80 text-base md:text-lg leading-snug'>
									The Post Square, Off Adeola Odeku, <br />
									Victoria Island, Lagos, Nigeria
								</p>
							</div>

							<div className='flex items-center gap-4'>
								<div className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10'>
									<Mail className='w-5 h-5 text-yellowVB-100' />
								</div>
								<p className='text-white/80 text-base md:text-lg'>
									info@rumer.com
								</p>
							</div>

							<div className='flex items-center gap-4'>
								<div className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10'>
									<Phone className='w-5 h-5 text-yellowVB-100' />
								</div>
								<p className='text-white/80 text-base md:text-lg'>
									+234 (0) 8374 2378 332
								</p>
							</div>
						</div>

						<div className='flex items-center gap-6 mt-4'>
							<a
								href='#'
								className='text-white hover:text-yellowVB-100 transition-colors'
							>
								<FaXTwitter
									className='w-6 h-6'
									fill='currentColor'
									strokeWidth={0}
								/>
							</a>
							<a
								href='#'
								className='text-white hover:text-yellowVB-100 transition-colors'
							>
								<Facebook
									className='w-6 h-6'
									fill='currentColor'
									strokeWidth={0}
								/>
							</a>
							<a
								href='#'
								className='text-white hover:text-yellowVB-100 transition-colors'
							>
								<Linkedin
									className='w-6 h-6'
									fill='currentColor'
									strokeWidth={0}
								/>
							</a>
							<a
								href='#'
								className='text-white hover:text-yellowVB-100 transition-colors'
							>
								<Instagram className='w-6 h-6' />
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ConnectWithUs;
