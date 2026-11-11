"use client";
import React, { useRef } from "react";
import { MainTitle, SubTitle } from "@/components/titles";
import Image from "next/image";
import { motion } from "framer-motion";
import Picture from "@/components/reusables/Picture";
import { exporterImg } from "../../../../public";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const networkMembers = [
	{
		label: "Exporters",
		image: exporterImg,
		alt: "Livestock exporter with digital tools",
	},
	{
		label: "Farmers",
		image: exporterImg,
		alt: "Farmer tending to cattle in field",
	},
	{
		label: "Processor",
		image: exporterImg,
		alt: "Meat processing with traceability",
	},
	{
		label: "Regulators",
		image: exporterImg,
		alt: "Government official monitoring farm",
	},
] as const;

const JoinGrowingNetwork = () => {
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
		}
	};

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
		}
	};

	return (
		<section className='pt-6 pb-10 sm:py-20 lg:py-12 bg-white'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Title & Description */}
				<div className='mb-6 lg:mb-2'>
					<MainTitle
						title='Join our growing network'
						className='text-primary-200 !text-3xl sm:!text-4xl lg:!text-5xl xl:!text-7xl !mx-0 !tracking-tight'
					/>
					<SubTitle
						title='Rumer serves as the ultimate digital ledger for agriculture in Africa, establishing a reliable source of truth that fosters trust, speeds up certifications, and paves the way for new market opportunities.'
						className='mt-4 sm:mt-6 text-black-100/80 text-base sm:text-lg lg:text-xl max-w-4xl !mx-0 text-start leading-relaxed'
					/>
				</div>

				{/* Image Grid */}
				<div className='relative group'>
					{/* Navigation Arrows - Positioned at top right */}
					<div className='absolute top-0 right-0 flex items-center gap-2 pointer-events-none z-50 pr-2 lg:pr-4 pt-2'>
						{/* Left Arrow */}
						<button
							onClick={scrollLeft}
							className='pointer-events-auto w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200 flex items-center justify-center duration-300 hover:bg-white hover:scale-105 transform transition-all'
							aria-label='Scroll left'
						>
							<ChevronLeftIcon className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-black-100' />
						</button>

						{/* Right Arrow */}
						<button
							onClick={scrollRight}
							className='pointer-events-auto w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200 flex items-center justify-center duration-300 hover:bg-white hover:scale-105 transform transition-all'
							aria-label='Scroll right'
						>
							<ChevronRightIcon className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-black-100' />
						</button>
					</div>

					{/* Scrollable Container - Added top padding to make space for arrows */}
					<div
						ref={scrollContainerRef}
						className='flex gap-4 sm:gap-6 lg:gap-10 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4 pt-14 sm:pt-16 lg:pt-20'
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						{networkMembers.map((member, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8, delay: index * 0.1 }}
								className='flex-shrink-0 w-48 sm:w-56 lg:w-64 xl:w-[284px] snap-center'
							>
								<div className='relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl ring-1 ring-gray-200 bg-white'>
									<Picture
										src={member.image}
										alt={member.alt}
										className='w-full object-cover'
									/>
								</div>
								<p className='mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg font-semibold text-black-100'>
									{member.label}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default JoinGrowingNetwork;
