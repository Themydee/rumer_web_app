"use client";

import React from "react";
import { ArrowRight, Check } from "lucide-react";
import Picture from "@/components/reusables/Picture";
import { ourMissionImg } from "../../../../public";

const Mission = () => {
	return (
		<section className='w-full bg-green_1-200 py-16 md:py-24 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center'>
				{/* Left Side: Image */}
				<div className='w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden relative'>
					<Picture
						src={ourMissionImg}
						alt='Our Mission - Handshake'
						className='w-full h-full object-cover'
					/>
				</div>

				{/* Right Side: Content */}
				<div className='w-full flex flex-col items-center text-center'>
					<h2 className='text-4xl md:text-5xl font-semibold text-black-100 mb-8 tracking-tight'>
						Our Mission
					</h2>
					<p className='text-base md:text-lg text-black-100 leading-relaxed mb-10 max-w-xl'>
						To build the trusted digital infrastructure that makes livestock
						trade across Africa, more transparent, financeable and globally
						competitive.
					</p>

					<div className='flex flex-wrap justify-center gap-6 md:gap-8 mb-10'>
						{["Trust Restored", "Opportunity Unlocked", "Shared Prosperity"].map(
							(item, index) => (
								<div key={index} className='flex items-center gap-2.5'>
									<div className='w-6 h-6 rounded-full bg-green_1-100 flex items-center justify-center flex-shrink-0'>
										<Check className='w-3.5 h-3.5 text-white' strokeWidth={3} />
									</div>
									<span className='text-black-100 font-medium text-base'>
										{item}
									</span>
								</div>
							),
						)}
					</div>

					<button className='bg-black-100 text-white px-8 py-3.5 rounded-full font-medium hover:bg-black-100/90 transition-all flex items-center gap-2.5 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base'>
						Get Started
						<ArrowRight className='w-4 h-4' />
					</button>
				</div>
			</div>
		</section>
	);
};

export default Mission;
