"use client";
import VCHeroBanner from "@/app/(variantC-home)/_components/VCHeroBanner";
import VCLivestockCarousel from "@/app/(variantC-home)/_components/VCLivestockCarousel";
import React, { useRef } from "react";
import {
	GroupOfGoats,
	GroupOfGoats1,
	GroupOfHen,
	ManButcher,
	Turkey,
	goat1,
	hen1,
	hens,
} from "../../../../public";
import { ProducerHeroIcon } from "@/components/utils/SVGIcons";

const VCHeroBannerProducer = () => {
	const carouselRef = useRef<HTMLDivElement>(null);

	const livestockImages = [
		{ src: GroupOfGoats, alt: "Group of goats" },
		{ src: GroupOfGoats1, alt: "Goats in the field" },
		{ src: GroupOfHen, alt: "Group of hens" },
		{ src: ManButcher, alt: "Butcher" },
		{ src: goat1, alt: "Goat" },
		{ src: hens, alt: "Group of hens" },
		{ src: hen1, alt: "Single hen" },
		{ src: Turkey, alt: "Turkey" },
	];

	const handleScrollLeft = () => {
		const carousel = document.querySelector("[data-carousel]");
		if (carousel) {
			const cardWidth = carousel.querySelector("div")?.offsetWidth || 300;
			carousel.scrollBy({
				left: -(cardWidth + 24),
				behavior: "smooth",
			});
		}
	};

	const handleScrollRight = () => {
		const carousel = document.querySelector("[data-carousel]");
		if (carousel) {
			const cardWidth = carousel.querySelector("div")?.offsetWidth || 300;
			carousel.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
		}
	};

	return (
		<>
			<VCHeroBanner
				badgeIcon={<ProducerHeroIcon className='w-5 h-5' />}
				bgColorIcon='bg-secondaryTwo-100'
				badgeText='Trusted Livestock Supply'
				title='Build a More Profitable Livestock Business'
				subtitle='Rumer helps livestock producers move from informal local markets to verified, premium global trade.'
				buttonText='Join as a Producer'
				buttonHref='/signup'
				showCarouselControls={false}
				showGridPattern={true}
			/>

			<VCLivestockCarousel
				images={livestockImages}
				onPrevClick={handleScrollLeft}
				onNextClick={handleScrollRight}
			/>
		</>
	);
};

export default VCHeroBannerProducer;
