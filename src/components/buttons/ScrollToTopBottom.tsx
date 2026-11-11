"use client";
import React, { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const ScrollIndicator = () => {
	const [showIndicator, setShowIndicator] = useState(false);
	const [showUp, setShowUp] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const viewportHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;

			// Show indicator after scrolling past first viewport
			if (scrollY > viewportHeight * 0.3) {
				setShowIndicator(true);
			} else {
				setShowIndicator(false);
			}

			// Show up arrow when scrolled more than one viewport down
			if (scrollY > viewportHeight) {
				setShowUp(true);
			} else {
				setShowUp(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll(); // Initial check

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const scrollDownOnePage = () => {
		window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
	};

	if (!showIndicator) return null;

	return (
		<div className='fixed bottom-8 right-6 lg:right-12 z-50 flex flex-col items-center gap-4 pointer-events-none'>
			{/* Container with pointer-events-none, buttons override */}
			<div className='flex flex-col items-center gap-2 lg:gap-4'>
				{/* Up Arrow */}
				{showUp && (
					<button
						onClick={scrollToTop}
						className='pointer-events-auto group size-12 lg:size-14 rounded-full bg-white/90 backdrop-blur-md shadow-2xl border border-secondary-100/30 flex items-center justify-center hover:shadow-3xl hover:bg-white hover:border-secondary-100 transition-all duration-500'
						aria-label='Scroll to top'
					>
						<ChevronUp className='text-xs lg:text-base text-primary-100 group-hover:text-secondary-100 transition-colors duration-300' />
					</button>
				)}

				{/* Down Arrow */}
				<button
					onClick={scrollDownOnePage}
					className='pointer-events-auto group size-12 lg:size-14 rounded-full bg-white/90 backdrop-blur-md shadow-2xl border border-secondary-100/30 flex items-center justify-center hover:shadow-3xl hover:bg-white hover:border-secondary-100 transition-all duration-500'
					aria-label='Scroll down'
				>
					<ChevronDown className='text-xs lg:text-base text-primary-100 group-hover:text-secondary-100 transition-colors duration-300' />
				</button>
			</div>
		</div>
	);
};

export default ScrollIndicator;
