"use client";
import React, { useRef, useState, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface HorizontalScrollProps {
	children: React.ReactNode;
	className?: string;
	scrollContainerClassName?: string;
	showControls?: boolean;
	controlSize?: "sm" | "md" | "lg";
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
	children,
	className = "",
	scrollContainerClassName = "",
	showControls = true,
	controlSize = "md",
}) => {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(true);

	const checkScrollPosition = useCallback(() => {
		if (scrollContainerRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } =
				scrollContainerRef.current;
			setShowLeftArrow(scrollLeft > 0);
			setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
		}
	}, []);

	const scroll = useCallback((direction: "left" | "right") => {
		if (scrollContainerRef.current) {
			const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
			const newPosition =
				scrollContainerRef.current.scrollLeft +
				(direction === "right" ? scrollAmount : -scrollAmount);

			scrollContainerRef.current.scrollTo({
				left: newPosition,
				behavior: "smooth",
			});
		}
	}, []);

	const controlSizes = {
		sm: "w-8 h-8",
		md: "w-10 h-10",
		lg: "w-12 h-12",
	};

	return (
		<div className={`relative group ${className}`}>
			{/* Scroll Controls */}
			{showControls && (
				<>
					{/* Left Arrow */}
					{showLeftArrow && (
						<button
							onClick={() => scroll("left")}
							className={`absolute left-2 top-1/2 -translate-y-1/2 ${controlSizes[controlSize]} bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-xl z-10 backdrop-blur-sm`}
							aria-label='Scroll left'
						>
							<FaChevronLeft className='text-gray-700 text-sm' />
						</button>
					)}

					{/* Right Arrow */}
					{showRightArrow && (
						<button
							onClick={() => scroll("right")}
							className={`absolute right-2 top-1/2 -translate-y-1/2 ${controlSizes[controlSize]} bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-xl z-10 backdrop-blur-sm`}
							aria-label='Scroll right'
						>
							<FaChevronRight className='text-gray-700 text-sm' />
						</button>
					)}
				</>
			)}

			{/* Scroll Container */}
			<div
				ref={scrollContainerRef}
				onScroll={checkScrollPosition}
				className={`flex gap-6 overflow-x-auto sm:gap-8 no-scrollbar ${scrollContainerClassName}`}
			>
				{children}
			</div>
		</div>
	);
};

export default HorizontalScroll;
