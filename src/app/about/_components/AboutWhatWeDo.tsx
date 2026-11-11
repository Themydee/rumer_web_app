"use client";

import { Check } from "lucide-react";
import React from "react";
import { RiCheckFill } from "react-icons/ri";

const AboutWhatWeDo = () => {
	const points = [
		"Discover trusted livestock listings.",
		"Verify farms and sellers.",
		"Trade securely and efficiently.",
		"Access tools that support growth and sustainability.",
	];

	return (
		<section className='w-full bg-white pb-16 md:py-24 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-start'>
					{/* Left Column */}
					<div className='flex flex-col gap-4 lg:gap-6'>
						<span className='md:text-base font-medium text-black-100'>
							Rumer
						</span>
						<h2 className='text-4xl md:text-5xl lg:text-6xl font-normal font-inter text-black-100 tracking-tight leading-tight'>
							What We Do
						</h2>
						<p className='text-base md:text-lg text-vcwhatmakesrummerdifferent-400 font-inter leading-loose max-w-xl'>
							Rumer builds the digital infrastructure that enables livestock to be
							registered, verified, tracked, financed, traded and traced across the
							entire value chain. By replacing fragmented & paper based processes
							with trusted immutable digital records, we help markets operate with
							greater confidence, security, efficiency and transparency.
						</p>
					</div>

					{/* Right Column */}
					<div className='flex flex-col gap-8 mt-4 lg:mt-0'>
						{points.map((point, index) => (
							<div key={index} className='flex items-center gap-4'>
								<div className='flex-shrink-0 p-1 rounded-full bg-green_1-100 flex items-center justify-center mt-1'>
									<RiCheckFill className='text-xl text-white' />
								</div>
								<p className='text-lg md:text-xl text-black-100 leading-snug font-inter'>
									{point}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default AboutWhatWeDo;
