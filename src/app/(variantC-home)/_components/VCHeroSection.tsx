"use client";

import { Button } from "@heroui/react";
import { ArrowRight, ShoppingCart } from "lucide-react";
import Picture from "@/components/reusables/Picture";
import { gridPattern, hero1img, hero2img } from "../../../../public";
import { RumerBadge } from "@/components/utils/functions";
import { GetStartedLink } from "@/components/reusables/button";
import {
	PackageIcon,
	TruckIcon,
	TruckOutlineIcon,
} from "@/components/utils/SVGIcons";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

interface VCHeroSectionProps {
	frontViewComponentPost?: FrontViewComponentContent | null;
}

const defaultHeroImage = (src: string, alt: string): FrontImageNode => ({
	node: { sourceUrl: src, altText: alt, mediaDetails: { sizes: [] } },
});

const defaultFrontViewData: FrontViewComponentContent = {
	id: "default-hero",
	title: "Rumer",
	frontViewComponent: {
		leftSection: {
			description:
				"Rumer connects verified producers, buyers, processors, and exporters through a secure, data-driven livestock ecosystem built on provenance, traceability, verification and secure transactions.",
			tag: "Verified Livestock Marketplace",
			titleBreaks: {
				one: "Source Verified",
				two: "Livestock With",
				three: "Complete",
				four: "Traceability",
			},
			joinEarlyAccessButton: {
				title: "Get Started",
				url: "/signup",
			},
		},
		rightSide: {
			imageViewOne: {
				image: defaultHeroImage("/home/hero1img.jpg", "Main livestock image"),
				tag: {
					name: "Verified Livestock",
					icon: defaultHeroImage("/home/rumer-green-short.png", "Verified"),
				},
			},
			imageViewTwo: {
				tag: "Escrow Protected",
				image: defaultHeroImage("/home/hero2img.jpg", "Secondary livestock image"),
			},
		},
		additonalCard: {
			name: "Sokoto Gudali",
			title: "Recent Trade",
			amount: 850000,
			dateAndCategory: "Verified • Kaduna Cluster",
			image: defaultHeroImage("/home/rumer-green-short.png", "Trade"),
		},
	},
};

export default function VCHeroSection({
	frontViewComponentPost,
}: VCHeroSectionProps) {
	const fallback = defaultFrontViewData.frontViewComponent;
	const fvc = frontViewComponentPost?.frontViewComponent;
	const left = fvc?.leftSection;
	const right = fvc?.rightSide;
	const card = fvc?.additonalCard;

	const mainTitle = frontViewComponentPost?.title || defaultFrontViewData.title;
	const description = left?.description || fallback.leftSection.description;
	const tag = left?.tag || fallback.leftSection.tag;
	const one = left?.titleBreaks?.one || fallback.leftSection.titleBreaks.one;
	const two = left?.titleBreaks?.two || fallback.leftSection.titleBreaks.two;
	const three = left?.titleBreaks?.three || fallback.leftSection.titleBreaks.three;
	const four = left?.titleBreaks?.four || fallback.leftSection.titleBreaks.four;
	const buttonTitle =
		left?.joinEarlyAccessButton?.title ||
		fallback.leftSection.joinEarlyAccessButton.title;
	const buttonUrl =
		left?.joinEarlyAccessButton?.url ||
		fallback.leftSection.joinEarlyAccessButton.url;

	const imageViewOne = {
		image: right?.imageViewOne?.image?.node?.sourceUrl
			? right.imageViewOne.image
			: fallback.rightSide.imageViewOne.image,
		tag: {
			name:
				right?.imageViewOne?.tag?.name ||
				fallback.rightSide.imageViewOne.tag.name,
			icon: right?.imageViewOne?.tag?.icon?.node?.sourceUrl
				? right.imageViewOne.tag.icon
				: fallback.rightSide.imageViewOne.tag.icon,
		},
	};

	const imageViewTwo = {
		tag: right?.imageViewTwo?.tag || fallback.rightSide.imageViewTwo.tag,
		image: right?.imageViewTwo?.image?.node?.sourceUrl
			? right.imageViewTwo.image
			: fallback.rightSide.imageViewTwo.image,
	};

	const cardName = card?.name || fallback.additonalCard.name;
	const cardTitle = card?.title || fallback.additonalCard.title;
	const cardAmount = Number(card?.amount) || fallback.additonalCard.amount;
	const cardDateCategory =
		card?.dateAndCategory || fallback.additonalCard.dateAndCategory;
	const cardImage = card?.image?.node?.sourceUrl
		? card.image
		: fallback.additonalCard.image;

	// Format currency
	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		}).format(amount);
	};

	// Refs for GSAP animations
	const sectionRef = useRef<HTMLElement>(null);
	const badgeRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const descriptionRef = useRef<HTMLParagraphElement>(null);
	const ctaRef = useRef<HTMLDivElement>(null);
	const mainImageRef = useRef<HTMLDivElement>(null);
	const secondaryImageRef = useRef<HTMLDivElement>(null);
	const topBadgeRef = useRef<HTMLDivElement>(null);
	const packageBadgeRef = useRef<HTMLDivElement>(null);
	const transactionCardRef = useRef<HTMLDivElement>(null);
	const patternRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Animate background pattern
			gsap.fromTo(
				patternRef.current,
				{
					scale: 1.2,
					opacity: 0,
					rotation: 5,
				},
				{
					scale: 1,
					opacity: 0.8,
					rotation: 0,
					duration: 1.5,
					ease: "power3.out",
					delay: 0.3,
				},
			);

			// Staggered text animation
			const titleLines = gsap.utils.toArray(
				titleRef.current?.querySelectorAll("br + span, br") || [],
			);
			gsap.fromTo(
				titleLines,
				{
					y: 50,
					opacity: 0,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.8,
					stagger: 0.15,
					ease: "power3.out",
					delay: 0.5,
				},
			);

			// Badge animation
			gsap.fromTo(
				badgeRef.current,
				{
					y: -30,
					scale: 0.8,
					opacity: 0,
				},
				{
					y: 0,
					scale: 1,
					opacity: 1,
					duration: 0.7,
					ease: "back.out(1.7)",
					delay: 0.4,
				},
			);

			// Description animation
			gsap.fromTo(
				descriptionRef.current,
				{
					y: 30,
					opacity: 0,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.8,
					ease: "power2.out",
					delay: 0.9,
				},
			);

			// CTA button animation
			gsap.fromTo(
				ctaRef.current,
				{
					y: 20,
					opacity: 0,
					scale: 0.9,
				},
				{
					y: 0,
					opacity: 1,
					scale: 1,
					duration: 0.6,
					ease: "back.out(1.5)",
					delay: 1.1,
				},
			);

			// Main image animation (slide in from left)
			gsap.fromTo(
				mainImageRef.current,
				{
					x: -100,
					opacity: 0,
					scale: 0.9,
				},
				{
					x: 0,
					opacity: 1,
					scale: 1,
					duration: 1,
					ease: "power3.out",
					delay: 0.7,
				},
			);

			// Secondary image animation (slide in from right)
			gsap.fromTo(
				secondaryImageRef.current,
				{
					x: 100,
					opacity: 0,
					scale: 0.9,
				},
				{
					x: 0,
					opacity: 1,
					scale: 1,
					duration: 1,
					ease: "power3.out",
					delay: 0.9,
				},
			);

			// Top badge animation (slide down with bounce)
			gsap.fromTo(
				topBadgeRef.current,
				{
					y: -50,
					opacity: 0,
					rotation: -5,
				},
				{
					y: 0,
					opacity: 1,
					rotation: 0,
					duration: 0.8,
					ease: "bounce.out",
					delay: 1.2,
				},
			);

			// Package badge animation (slide up with bounce)
			gsap.fromTo(
				packageBadgeRef.current,
				{
					y: 50,
					opacity: 0,
					rotation: 5,
				},
				{
					y: 0,
					opacity: 1,
					rotation: 0,
					duration: 0.8,
					ease: "bounce.out",
					delay: 1.4,
				},
			);

			// Transaction card animation (slide up with subtle scale)
			gsap.fromTo(
				transactionCardRef.current,
				{
					y: 80,
					opacity: 0,
					scale: 0.8,
				},
				{
					y: 0,
					opacity: 1,
					scale: 1,
					duration: 0.9,
					ease: "power3.out",
					delay: 1.6,
				},
			);

			// Animate shopping cart icon in transaction card
			const cartIcon = transactionCardRef.current?.querySelector(
				".shopping-cart-icon",
			);
			if (cartIcon) {
				gsap.fromTo(
					cartIcon,
					{
						scale: 0,
						rotation: -180,
					},
					{
						scale: 1,
						rotation: 0,
						duration: 0.6,
						ease: "back.out(2)",
						delay: 1.9,
					},
				);
			}

			// Create a floating animation for badges
			gsap.to([topBadgeRef.current, packageBadgeRef.current], {
				y: "-=10",
				duration: 2,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
				delay: 2,
			});

			// Parallax effect for images on scroll
			ScrollTrigger.create({
				trigger: sectionRef.current,
				start: "top top",
				end: "bottom top",
				scrub: 1,
				onUpdate: (self) => {
					if (mainImageRef.current) {
						gsap.to(mainImageRef.current, {
							y: self.progress * 50,
							duration: 0.1,
						});
					}
					if (secondaryImageRef.current) {
						gsap.to(secondaryImageRef.current, {
							y: self.progress * 30,
							duration: 0.1,
						});
					}
				},
			});

			// Hover animations for interactive elements
			const ctaButton = ctaRef.current?.querySelector("a, button");
			if (ctaButton) {
				ctaButton.addEventListener("mouseenter", () => {
					gsap.to(ctaButton, {
						scale: 1.05,
						duration: 0.3,
						ease: "power2.out",
					});
				});

				ctaButton.addEventListener("mouseleave", () => {
					gsap.to(ctaButton, {
						scale: 1,
						duration: 0.3,
						ease: "power2.out",
					});
				});
			}

			// Animate transaction amount
			const transactionAmount = transactionCardRef.current?.querySelector(
				".transaction-amount",
			);
			if (transactionAmount) {
				gsap.fromTo(
					transactionAmount,
					{
						scale: 0.5,
						opacity: 0,
					},
					{
						scale: 1,
						opacity: 1,
						duration: 0.5,
						delay: 2.1,
						ease: "back.out(2)",
					},
				);
			}
		});

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			className='w-full bg-white text-black-100 pt-8 lg:pt-5 xl:pt-0 px-3 lg:px-8 xl:px-0 lg:grid place-items-center lg:h-[90vh] relative'
		>
			<div
				className='absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none'
				ref={patternRef}
			>
				<Picture
					src={gridPattern}
					className='absolute top-4 left-1/2 transform -translate-x-1/2 opacity-60 
				sm:opacity-70 lg:opacity-80 lg:-top-10 lg:object-contain lg:w-[1200px]'
					alt=''
				/>
			</div>

			<div className='mx-auto flex flex-col lg:grid grid-cols-1 lg:grid-cols-10 gap-6 xl:gap-8 items-center relative pt-20 sm:pt-20'>
				<div className='space-y-2 xl:space-y-4 z-10 w-full md:col-span-4 col-span-5 px-3 sm:px-5 lg:px-0'>
					<div
						ref={badgeRef}
						className='flex w-full justify-center lg:justify-start'
					>
						<RumerBadge className='mb-1 xl:mb-2' title={tag} />
					</div>

					<h1
						ref={titleRef}
						className='text-3xl sm:text-4xl xl:text-5xl text-center lg:text-left font-light lg:leading-[1.2] tracking-tight'
					>
						<span className='inline-block'>{one}</span>
						<br />
						<span className='inline-block'>{two}</span>
						<br />
						<span className='inline-block'>{three}</span>
						<br />
						<span className='inline-block'>{four}</span>
					</h1>

					<p
						ref={descriptionRef}
						className='text-sm sm:text-base xl:text-lg text-center lg:text-start md:text-xl font-extralight lg:font-light font-inter max-w-xs lg:max-w-lg leading-relaxed'
					>
						Rumer connects verified producers, buyers, processors, and exporters through a secure, data-driven livestock ecosystem built on provenance, traceability, verification and secure transactions.
					</p>

					<div
						ref={ctaRef}
						className='pt-2 sm:pt-3 w-full flex justify-center sm:block relative group/hero-tooltip'
					>
						<Link
							href="/signup"
							className='bg-black-100 font-inter w-fit text-white space-x-2 text-sm sm:text-base group font-light px-6 py-3 rounded-lg shadow hover:bg-black-100 transition-[.3] flex items-center'
						>
							<span className='whitespace-nowrap'>{buttonTitle}</span>
							<ArrowRight className='group-hover:translate-x-1 transition-[.3] text-lg' />
						</Link>
					</div>
				</div>

				<div className='relative w-full flex justify-center lg:justify-between col-span-6 '>
					{/* desktop */}
					<div className='hidden sm:flex w-full h-[260px] sm:h-[330px] relative'>
						{/* Main Image */}
						<div
							ref={mainImageRef}
							className='
                absolute 
                -translate-x-1/2 
                top-6 sm:top-8
                w-full h-[280px] 
                sm:w-[300px] sm:h-[300px] 
                lg:left-12 lg:translate-x-0 
                lg:top-[40px] lg:w-[374px] lg:h-[387px]
                xl:w-[434px] xl:h-[427px] rounded-lg
                lg:rounded-2xl overflow-hidden shadow-lg z-10
              '
						>
							<div className='relative w-full h-full'>
								<Picture
									src={imageViewOne.image.node.sourceUrl}
									alt={
										imageViewOne.image.node.altText || "Main livestock image"
									}
									className='w-full h-full object-cover'
								/>
								<div className='absolute inset-0 bg-green-fade pointer-events-none' />
								<div className='absolute inset-0 bg-black-100/10 pointer-events-none' />
							</div>
						</div>

						{/* Secondary Image */}
						<div
							ref={secondaryImageRef}
							className='
                absolute 
                hidden sm:block
                -top-6 sm:-top-10 
                right-3 sm:right-8 
                lg:-top-12 lg:right-0 
                w-[120px] h-[180px] 
                sm:w-[180px] sm:h-[260px] lg:w-[130px] lg:h-[326px]
                xl:w-[245px] xl:h-[426px]
                rounded-l-2xl overflow-hidden shadow-lg
                z-20
              '
						>
							<Picture
								src={imageViewTwo.image.node.sourceUrl}
								alt={imageViewTwo.image.node.altText || "Secondary image"}
								className='w-full h-full object-cover'
							/>
							<div
								className='absolute inset-0 pointer-events-none'
								style={{
									background:
										"linear-gradient(180deg, rgba(1, 72, 52, 0) 0%, rgba(1, 72, 52, 0.38) 46.17%)",
								}}
							/>
						</div>

						{/* Top Badge */}
						<div
							ref={topBadgeRef}
							className='
                absolute flex items-center gap-2 
                border border-white 
                bg-secondary-400 text-white 
                left-4 text-xs font-medium
                px-2 py-1 sm:px-2 sm:py-3 rounded-md sm:rounded-lg 
                shadow-lg z-30 tracking-wider w-[250px]
                top-2 sm:top-4 
                translate-x-1/2 
                lg:left-[220px] lg:translate-x-0
              '
						>
							<Picture
								src={imageViewOne.tag?.icon.node.sourceUrl}
								alt={imageViewOne.tag?.icon.node.altText || "Tag icon"}
								className='!size-5 object-contain'
							/>
							{imageViewOne.tag.name}
						</div>

						{/* Package Badge */}
						<div
							ref={packageBadgeRef}
							className='
                absolute flex items-center gap-2  
                bg-secondary-600 text-white 
                border border-white
                text-xs font-medium
                px-2 py-1 sm:px-2 sm:py-3 rounded-md sm:rounded-lg 
                shadow-xl z-30 tracking-wider w-[250px]
                top-[160px] sm:-top-16 
                right-4 sm:right-36 
                translate-x-1/2 sm:translate-x-0
                lg:right-36
              '
						>
							<Picture
								src={cardImage?.node?.sourceUrl}
								alt={cardName || "Tag icon"}
								className='!size-5 object-contain'
							/>
							{imageViewTwo.tag}
						</div>

						{/* Transaction Card */}
						<div
							ref={transactionCardRef}
							className='
                absolute 
                -bottom-[70px] sm:-bottom-[100px] 
                left-8 -translate-x-1/2 lg:left-[80px]
                xl:left-[210px] lg:translate-x-0                
                bg-white border border-gray-200 shadow-xl rounded-xl 
                p-3 sm:px-2 sm:py-2 
                w-[230px] sm:w-[280px] lg:w-[320px] 
                z-30 font-inter
              '
						>
							<div className='flex justify-between items-center mb-3'>
								<p className='font-medium text-xs sm:text-base'>{cardTitle}</p>
								<button type='button' className='text-xs text-gray-600'>
									See all
								</button>
							</div>

							<div className='flex items-start gap-3'>
								<div className='w-9 h-9 sm:w-10 sm:h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0'>
									<ShoppingCart className='shopping-cart-icon w-4 h-4 sm:w-5 sm:h-5 text-green-600' />
								</div>

								<div className='flex-1 min-w-0'>
									<div className='flex justify-between items-start mb-1'>
										<p className='text-gray-900 font-medium text-xs lg:text-sm'>
											{cardName}
										</p>
										<p className='transaction-amount font-bold text-green-700 text-xs lg:text-sm whitespace-nowrap'>
											{formatCurrency(cardAmount)}
										</p>
									</div>
									<p className='text-xs text-gray-500'>{cardDateCategory}</p>
								</div>
							</div>
						</div>
					</div>

					{/* mobile */}
					<div className='w-full sm:hidden h-[300px] sm:h-[330px] relative'>
						<div
							ref={mainImageRef}
							className='
                absolute 
                top-6 sm:top-8
                w-full h-[280px] 
                sm:w-[300px] sm:h-[300px] 
                left-0 translate-x-0 
                lg:top-[40px] lg:w-[374px] lg:h-[387px]
                xl:w-[434px] xl:h-[427px] rounded-lg
                lg:rounded-2xl overflow-hidden shadow-lg z-10
              '
						>
							<div className='relative w-full h-full'>
								<Picture
									src={imageViewOne.image.node.sourceUrl}
									alt={
										imageViewOne.image.node.altText || "Main livestock image"
									}
									className='w-full h-full object-cover'
								/>
								<div className='absolute inset-0 bg-green-fade pointer-events-none' />
								<div className='absolute inset-0 bg-black-100/10 pointer-events-none' />
							</div>
						</div>

						{/* Top Badge - Mobile */}
						<div
							ref={topBadgeRef}
							className='
                absolute flex items-center gap-2 
                border border-white 
                bg-secondary-400 text-white 
                left-4 text-xs font-medium
                px-2 py-1 sm:px-2 sm:py-3 rounded-md sm:rounded-lg 
                shadow-lg z-30 tracking-wider w-[250px]
                top-2 sm:top-4 
                translate-x-0
              '
						>
							<Picture
								src={imageViewOne.tag?.icon.node.sourceUrl}
								alt={imageViewOne.tag?.icon.node.altText || "Tag icon"}
								className='!size-5 object-contain'
							/>
							{imageViewOne.tag.name}
						</div>

						{/* Package Badge - Mobile */}
						<div
							ref={packageBadgeRef}
							className='
                absolute flex items-center gap-2  
                bg-secondary-600 text-white 
                border border-white
                text-xs font-medium
                px-2 py-1 sm:px-2 sm:py-3 rounded-md sm:rounded-lg 
                shadow-xl z-30 tracking-wider w-[250px]
                top-[160px] sm:-top-16 
                right-4 sm:right-36 
                translate-x-0
              '
						>
							<Picture
								src={imageViewTwo.image.node.sourceUrl}
								alt={imageViewTwo.tag || "Tag icon"}
								className='!size-5 object-contain'
							/>
							{imageViewTwo.tag}
						</div>

						{/* Transaction Card - Mobile */}
						<div
							ref={transactionCardRef}
							className='
                absolute 
                -bottom-[70px] sm:-bottom-[100px]
                left-1/2 -translate-x-1/2                
                bg-white border border-gray-200 shadow-xl rounded-xl 
                p-3 sm:px-2 sm:py-2 
                w-[230px] sm:w-[280px] lg:w-[320px] 
                z-30 font-inter
              '
						>
							<div className='flex justify-between items-center mb-3'>
								<p className='font-medium text-xs sm:text-base'>{cardTitle}</p>
								<button type='button' className='text-xs text-gray-600'>
									See all
								</button>
							</div>

							<div className='flex items-start gap-3'>
								<div className='w-9 h-9 sm:w-10 sm:h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0'>
									<ShoppingCart className='shopping-cart-icon w-4 h-4 sm:w-5 sm:h-5 text-green-600' />
								</div>

								<div className='flex-1 min-w-0'>
									<div className='flex justify-between items-start mb-1'>
										<p className='text-gray-900 font-medium text-xs lg:text-sm'>
											{cardName}
										</p>
										<p className='transaction-amount font-bold text-green-700 text-xs lg:text-sm whitespace-nowrap'>
											{formatCurrency(cardAmount)}
										</p>
									</div>
									<p className='text-xs text-gray-500'>{cardDateCategory}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
