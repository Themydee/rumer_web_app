"use client";

import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";

interface PageTitleProps {
	title: string;
	subtitle: string;
}
export const PageTitle2 = ({ title, subtitle }: PageTitleProps) => {
	return (
		<div className='space-y-1 sm:space-y-2 w-fit'>
			<h1 className='text-xl sm:text-2xl lg:text-3xl font-bold leading-[1.9rem] text-white'>
				{title}
			</h1>
			<p className='font-normal text-primary-200 leading-5 text-xs sm:text-sm lg:w-full'>
				{subtitle}
			</p>
		</div>
	);
};

export const StarRating = ({
	initialRating = 0,
	onRate,
}: {
	initialRating?: number;
	onRate?: (rating: number) => void;
}) => {
	const [rating, setRating] = useState(initialRating);
	const [hover, setHover] = useState(0);

	return (
		<div className='flex items-center gap-1'>
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					type='button'
					className='focus:outline-none'
					onClick={() => {
						setRating(star);
						onRate?.(star);
					}}
					onMouseEnter={() => setHover(star)}
					onMouseLeave={() => setHover(0)}
					aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
				>
					{(hover || rating) >= star ? (
						<FaStar className='text-yellow-400' size={16} />
					) : (
						<FaRegStar className='text-yellow-400 opacity-70' size={16} />
					)}
				</button>
			))}
			<span className='text-gray-300 ml-1 text-xs'>
				{rating || initialRating}/5
			</span>
		</div>
	);
};
