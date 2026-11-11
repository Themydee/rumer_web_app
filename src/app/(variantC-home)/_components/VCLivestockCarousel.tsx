"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Picture from "@/components/reusables/Picture";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StaticImageData } from "next/image";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

interface LivestockImage {
	src: string | StaticImageData;
	alt: string;
}

interface VCLivestockCarouselProps {
	images: LivestockImage[];
	buttonText?: string;
	buttonHref?: string;
	onButtonClick?: () => void;
	onPrevClick?: () => void;
	onNextClick?: () => void;
	className?: string;
}

const VCLivestockCarousel: React.FC<VCLivestockCarouselProps> = ({
	images,
	buttonText,
	buttonHref = "#",
	onButtonClick,
	onPrevClick,
	onNextClick,
	className = "",
}) => {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const sectionRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	// Check scroll position
	const checkScrollPosition = () => {
		if (scrollContainerRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } =
				scrollContainerRef.current;
			setCanScrollLeft(scrollLeft > 0);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
		}
	};

	// Scroll left
	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			const cardWidth =
				scrollContainerRef.current.querySelector("div")?.offsetWidth || 300;
			scrollContainerRef.current.scrollBy({
				left: -(cardWidth + 24), // card width + gap
				behavior: "smooth",
			});
		}
	};

	// Scroll right
	const scrollRight = () => {
		if (scrollContainerRef.current) {
			const cardWidth =
				scrollContainerRef.current.querySelector("div")?.offsetWidth || 300;
			scrollContainerRef.current.scrollBy({
				left: cardWidth + 24, // card width + gap
				behavior: "smooth",
			});
		}
	};

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Animate section entrance
			gsap.fromTo(
				sectionRef.current,
				{
					y: 50,
					opacity: 0,
				},
				{
					y: 0,
					opacity: 1,
					duration: 1,
					ease: "power3.out",
					scrollTrigger: {
						trigger: sectionRef.current,
						start: "top 80%",
						toggleActions: "play none none reverse",
					},
				},
			);

			// Animate button
			if (buttonRef.current && buttonText) {
				gsap.fromTo(
					buttonRef.current,
					{
						y: -20,
						opacity: 0,
						scale: 0.9,
					},
					{
						y: 0,
						opacity: 1,
						scale: 1,
						duration: 0.6,
						ease: "back.out(1.5)",
						scrollTrigger: {
							trigger: sectionRef.current,
							start: "top 80%",
						},
					},
				);
			}

			// Animate cards
			const cards =
				scrollContainerRef.current?.querySelectorAll(".livestock-card");
			if (cards) {
				gsap.fromTo(
					cards,
					{
						y: 60,
						opacity: 0,
						scale: 0.9,
					},
					{
						y: 0,
						opacity: 1,
						scale: 1,
						duration: 0.8,
						stagger: 0.1,
						ease: "power3.out",
						scrollTrigger: {
							trigger: scrollContainerRef.current,
							start: "top 85%",
						},
					},
				);
			}
		});

		// Check initial scroll position
		checkScrollPosition();

		// Add scroll event listener
		const scrollContainer = scrollContainerRef.current;
		if (scrollContainer) {
			scrollContainer.addEventListener("scroll", checkScrollPosition);
		}

		return () => {
			ctx.revert();
			if (scrollContainer) {
				scrollContainer.removeEventListener("scroll", checkScrollPosition);
			}
		};
	}, [buttonText]);

	return (
		<div
			ref={sectionRef}
			className={`w-full bg-white pt-4 md:py-12 lg:py-16 pl-1 ${className}`}
		>
			<div className='mx-auto'>
				{/* Scrollable Container */}
				<div className='relative'>
					{/* Navigation Buttons - Top Right */}
					<div className='absolute -top-14 right-3 flex items-center gap-3 z-20'>
						<button
							onClick={onPrevClick || scrollLeft}
							disabled={!canScrollLeft}
							className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-black-100 text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:bg-black-200 ${
								!canScrollLeft ? "opacity-30 cursor-not-allowed" : "opacity-100"
							}`}
							aria-label='Previous'
						>
							<ArrowLeft className='w-5 h-5 md:w-6 md:h-6' />
						</button>

						<button
							onClick={onNextClick || scrollRight}
							disabled={!canScrollRight}
							className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-black-100 text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:bg-black-200 ${
								!canScrollRight
									? "opacity-30 cursor-not-allowed"
									: "opacity-100"
							}`}
							aria-label='Next'
						>
							<ArrowRight className='w-5 h-5 md:w-6 md:h-6' />
						</button>
					</div>

					{/* Scroll Container */}
					<div
						ref={scrollContainerRef}
						onScroll={checkScrollPosition}
						className='flex gap-5 md:gap-8 overflow-x-auto pb-8 scroll-smooth scrollbar-hide snap-x snap-mandatory'
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						{images.map((image, index) => (
							<div
								key={index}
								className='livestock-card group relative flex-shrink-0 w-[280px] sm:w-[350px] md:w-[400px] aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] snap-start cursor-pointer'
							>
								{/* Image */}
								<Picture
									src={image.src}
									alt={image.alt}
									className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110'
								/>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Hide scrollbar styles */}
			<style jsx>{`
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}
			`}</style>
		</div>
	);
};

export default VCLivestockCarousel;
