"use client";

import React from "react";
import { ArrowRight, Check } from "lucide-react";
import Picture from "@/components/reusables/Picture";
import { vissionImg } from "../../../../public";

const Vision = () => {
	return (
		<section className='w-full bg-yellowVB-200 py-16 md:py-24 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center'>
				{/* Left Side: Content */}
				<div className='w-full flex flex-col items-center text-center lg:items-center lg:text-center order-2 lg:order-1'>
					<h2 className='text-4xl md:text-5xl font-semibold text-black-100 mb-8 tracking-tight font-sf-pro'>
						Our vision is simple but powerful
					</h2>
					<p className='text-base md:text-lg text-black-100 leading-relaxed mb-10 max-w-xl font-sf-pro'>
						We envision an Africa where every livestock producer, every animal,
						every record and every transaction can be trusted by default—unlocking
						access to finance, new markets and long-term prosperity.
					</p>

					<div className='flex flex-wrap justify-center gap-6 md:gap-8 mb-10'>
						{["Trust By Design", "Digital Infrastructure", "Inclusive Growth"].map(
							(item, index) => (
								<div key={index} className='flex items-center gap-2.5'>
									<div className='w-6 h-6 rounded-full bg-green_1-100 flex items-center justify-center flex-shrink-0'>
										<Check className='w-3.5 h-3.5 text-white' strokeWidth={3} />
									</div>
									<span className='text-black-100 font-medium text-base font-sf-pro'>
										{item}
									</span>
								</div>
							),
						)}
					</div>

					<button className='bg-black-100 text-white px-8 py-3.5 rounded-full font-medium hover:bg-black-100/90 transition-all flex items-center gap-2.5 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base font-sf-pro'>
						Get Started
						<ArrowRight className='w-4 h-4' />
					</button>
				</div>

				{/* Right Side: Image */}
				<div className='w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden relative order-1 lg:order-2'>
					<Picture
						src={vissionImg}
						alt='Our Vision'
						className='w-full h-full object-cover'
					/>
				</div>
			</div>
		</section>
	);
};

export default Vision;
