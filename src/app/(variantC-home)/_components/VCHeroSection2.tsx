import { RumerBadge2 } from "@/components/utils/functions";
import { ArrowRight } from "lucide-react";
import { Poppins } from "next/font/google";
import React from "react";

const poppins = Poppins({
	subsets: ["latin-ext"],
	weight: ["300", "400", "500", "700"],
	style: ["normal"],
});

interface HeroSectionProps {
	badge?: string;
	title: string;
	titleBreaker?: string;
	description: string;
	className?: string;
	buttonLabel?: string;
}

const VCHeroSection1: React.FC<HeroSectionProps> = ({
	badge,
	title,
	titleBreaker,
	description,
	className,
	buttonLabel,
}) => {
	return (
		<section
			id='about'
			className={`w-full px-4 pt-28 sm:pt-32 lg:pt-20 xl:pt-44 ${
				className || ""
			}`}
		>
			<div className='max-w-5xl mx-auto text-center'>
				{/* Badge */}
				{badge && (
					<div className='flex justify-center mb-4 sm:mb-5'>
						<RumerBadge2 badgeText={badge} />
					</div>
				)}

				{/* Title */}
				<h1 className='text-2xl sm:text-4xl xl:text-6xl font-medium text-black-100 mb-4 sm:mb-6 leading-[1.15]'>
					{titleBreaker} <br />
					{title}
				</h1>

				{/* Description */}
				<p
					className={`text-sm xl:text-lg font-normal text-black-100 mx-auto leading-relaxed ${poppins.className}`}
				>
					{description}
				</p>
			</div>
			{buttonLabel && (
				<div className='flex justify-center mt-6'>
					<button
						className='inline-flex items-center gap-2 px-6 py-3 
            bg-black-100 text-white rounded-lg hover:bg-gray-800 
            transition-colors font-medium'
					>
						{buttonLabel}
						<ArrowRight className='w-4 h-4' />
					</button>
				</div>
			)}
		</section>
	);
};

export default VCHeroSection1;
