"use client";
import React, { useEffect, useRef } from "react";
import {
	Package,
	Store,
	Users,
	Lock,
	Shield,
	Boxes,
	Network,
	ArrowUpFromLine,
} from "lucide-react";
import { RumerBadge2, RummerLogo } from "@/components/utils/functions";
import {
	AwardIcon,
	CelebrationIcon,
	CubeStackIcon,
	FlowConnector,
	IsVerifiedIcon,
	LockMessageIcon,
	RocketIcon,
	VerifiedIcon,
	WaveIcon,
} from "@/components/utils/SVGIcons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VCHeroSection1 from "./VCHeroSection2";
import Picture from "@/components/reusables/Picture";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

interface VCInputsAppProps {
	introRumerPost: FeRumerContentType;
}

const VCInputsApp = ({ introRumerPost }: VCInputsAppProps) => {
	// Extract data from props
	const { introducingRumer } = introRumerPost;
	const { leftCard, rightCard, description, tagName, title, titleBrea } =
		introducingRumer;

	// Refs for GSAP animations
	const sectionRef = useRef<HTMLDivElement>(null);
	const problemCardRef = useRef<HTMLDivElement>(null);
	const badgeRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const descriptionRef = useRef<HTMLParagraphElement>(null);
	const solutionCardRef = useRef<HTMLDivElement>(null);
	const logoCardRef = useRef<HTMLDivElement>(null);
	const connectorRef = useRef<SVGSVGElement>(null);
	const producerCardRef = useRef<HTMLDivElement>(null);
	const verificationCardRef = useRef<HTMLDivElement>(null);
	const buyerCardRef = useRef<HTMLDivElement>(null);
	const iconsRefs = useRef<HTMLDivElement[]>([]);

	// Get image URLs for the logo
	const logoImage = rightCard.logoImage.node;
	const producerLogo1 = rightCard.boxOne.logo1.node;
	const producerLogo2 = rightCard.boxOne.logo2.node;
	const verificationLogo1 = rightCard.boxTwo.logo1.node;
	const verificationLogo2 = rightCard.boxTwo.logo2.node;
	const buyerLogo1 = rightCard.boxThree.logo1.node;
	const buyerLogo2 = rightCard.boxThree.logo2.node;
	const buyerLogo3 = rightCard.boxThree.logo3?.node; // Optional

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Create a master timeline for the entire section
			const masterTL = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 70%",
					end: "bottom 30%",
					toggleActions: "play none none reverse",
				},
			});

			// Problem card entrance
			masterTL.fromTo(
				problemCardRef.current,
				{
					x: -100,
					opacity: 0,
					scale: 0.95,
				},
				{
					x: 0,
					opacity: 1,
					scale: 1,
					duration: 0.8,
					ease: "power3.out",
				},
			);

			// Badge animation
			masterTL.fromTo(
				badgeRef.current,
				{
					y: -30,
					scale: 0.8,
					opacity: 0,
					rotation: -5,
				},
				{
					y: 0,
					scale: 1,
					opacity: 1,
					rotation: 0,
					duration: 0.6,
					ease: "back.out(1.7)",
				},
				"-=0.5",
			);

			// Title animation (word by word)
			const titleWords = titleRef.current?.textContent?.split(" ") || [];
			titleRef.current!.innerHTML = titleWords
				.map(
					(word) =>
						`<span class="title-word inline-block opacity-0">${word}</span>`,
				)
				.join(" ");

			gsap.to(titleRef.current!.querySelectorAll(".title-word"), {
				opacity: 1,
				y: 0,
				duration: 0.5,
				stagger: 0.08,
				ease: "power3.out",
				scrollTrigger: {
					trigger: titleRef.current,
					start: "top 80%",
				},
			});

			// Description animation
			masterTL.fromTo(
				descriptionRef.current,
				{
					y: 40,
					opacity: 0,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.7,
					ease: "power2.out",
				},
				"-=0.3",
			);

			// Solution card entrance
			masterTL.fromTo(
				solutionCardRef.current,
				{
					x: 100,
					opacity: 0,
					scale: 0.95,
				},
				{
					x: 0,
					opacity: 1,
					scale: 1,
					duration: 0.8,
					ease: "power3.out",
				},
				"-=0.6",
			);

			// Logo card animation
			masterTL.fromTo(
				logoCardRef.current,
				{
					scale: 0,
					opacity: 0,
					rotation: -180,
				},
				{
					scale: 1,
					opacity: 1,
					rotation: 0,
					duration: 0.6,
					ease: "back.out(1.8)",
				},
				"-=0.4",
			);

			// Connector animation
			if (connectorRef.current) {
				masterTL.fromTo(
					connectorRef.current,
					{
						scaleX: 0,
						opacity: 0,
					},
					{
						scaleX: 1,
						opacity: 1,
						duration: 0.8,
						ease: "power3.out",
					},
					"-=0.3",
				);
			}

			// Cards animation (producer, verification, buyer)
			const cards = [
				producerCardRef.current,
				verificationCardRef.current,
				buyerCardRef.current,
			];

			cards.forEach((card, index) => {
				if (card) {
					masterTL.fromTo(
						card,
						{
							y: 50,
							opacity: 0,
							scale: 0.8,
							rotationX: 15,
						},
						{
							y: 0,
							opacity: 1,
							scale: 1,
							rotationX: 0,
							duration: 0.6,
							ease: "back.out(1.5)",
						},
						`-=${0.5 - index * 0.1}`,
					);
				}
			});

			// Icons animation within cards
			iconsRefs.current.forEach((iconContainer, index) => {
				if (iconContainer) {
					const icons = iconContainer.querySelectorAll("div > div");
					gsap.fromTo(
						icons,
						{
							scale: 0,
							opacity: 0,
							rotation: -90,
						},
						{
							scale: 1,
							opacity: 1,
							rotation: 0,
							duration: 0.4,
							stagger: 0.1,
							ease: "back.out(2)",
							delay: 1 + index * 0.2,
							scrollTrigger: {
								trigger: iconContainer,
								start: "top 80%",
							},
						},
					);
				}
			});

			// Arrow indicators animation (mobile)
			const mobileArrows = sectionRef.current?.querySelectorAll("svg");
			if (mobileArrows) {
				gsap.fromTo(
					mobileArrows,
					{
						y: -10,
						opacity: 0,
					},
					{
						y: 0,
						opacity: 1,
						duration: 0.5,
						stagger: 0.2,
						ease: "power2.out",
						scrollTrigger: {
							trigger: sectionRef.current,
							start: "top 70%",
						},
					},
				);

				// Pulsate arrows
				gsap.to(mobileArrows, {
					y: -5,
					duration: 1,
					repeat: -1,
					yoyo: true,
					ease: "sine.inOut",
				});
			}

			// Background glow effect on hover for cards
			const allCards = [
				problemCardRef.current,
				solutionCardRef.current,
				...cards,
			];
			allCards.forEach((card) => {
				if (card) {
					card.addEventListener("mouseenter", () => {
						gsap.to(card, {
							boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
							duration: 0.3,
							ease: "power2.out",
						});
					});

					card.addEventListener("mouseleave", () => {
						gsap.to(card, {
							boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
							duration: 0.3,
							ease: "power2.out",
						});
					});
				}
			});

			// Sequential color animation for the connector
			if (connectorRef.current) {
				gsap.to(connectorRef.current.querySelectorAll("path"), {
					strokeDashoffset: 0,
					duration: 1.5,
					stagger: 0.1,
					ease: "power3.out",
					scrollTrigger: {
						trigger: connectorRef.current,
						start: "top 80%",
					},
				});
			}

			// Subttyl wave animation for the solution card background
			gsap.to(solutionCardRef.current, {
				backgroundPosition: "0% 0%",
				duration: 20,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});
		});

		return () => ctx.revert();
	}, []);

	return (
		<>
			<VCHeroSection1
				badge={tagName}
				titleBreaker={titleBrea}
				title={title}
				description={description}
			/>
			<div
				ref={sectionRef}
				className='w-full mx-auto md:px-6 py-6 md:py-8 lg:py-12 px-4 overflow-hidden'
			>
				<div className='grid lg:grid-cols-10 gap-2 md:gap-4 xl:gap-12 items-stretch'>
					{/* Problem Card */}
					<div
						ref={problemCardRef}
						className='bg-vcinputsapp-900 rounded-xl lg:rounded-[32px] lg:col-span-6 col-span-full p-6 md:p-8 lg:p-16 flex flex-col justify-center h-full relative overflow-hidden'
					>
						<div className='inline-block mb-4 md:mb-6' ref={badgeRef}>
							<RumerBadge2 badgeText={leftCard.cardTag} />
						</div>

						<h2
							ref={titleRef}
							className='text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-extralight tracking-wide text-black-100 leading-[1.4] xl:leading-[1.5] mb-4 md:mb-6'
						>
							{leftCard.title}
						</h2>

						<p
							ref={descriptionRef}
							className='text-black-200 font-extralight font-inter text-sm sm:text-base md:text-lg xl:text-2xl leading-relaxed md:leading-relaxed'
						>
							{leftCard.description}
						</p>

						{/* Animated background elements */}
						<div className='absolute -right-10 -top-10 w-40 h-40 bg-vcinputsapp-800/20 rounded-full blur-3xl'></div>
						<div className='absolute -left-10 -bottom-10 w-60 h-60 bg-vcinputsapp-900/10 rounded-full blur-3xl'></div>
					</div>

					{/* Solution Card */}
					<div
						ref={solutionCardRef}
						className='bg-gray_1-300 rounded-xl lg:rounded-[32px] lg:col-span-4 col-span-full p-6 md:py-8 xl:p-12 flex items-center justify-center h-full relative overflow-hidden min-h-[400px] md:min-h-[500px]'
					>
						<div className='flex flex-col md:flex-row items-center justify-between w-full h-full max-w-lg relative z-10 gap-6 xl:gap-0'>
							{/* Logo Card */}
							<div className='flex-shrink-0 z-20 md:w-auto w-full'>
								<div
									ref={logoCardRef}
									className='bg-vcinputsapp-600 rounded-2xl shadow-lg w-full sm:w-[110px] h-[50px] sm:h-[60px] flex items-center justify-center relative border border-white/10 mx-auto'
								>
									<div className='hidden md:block absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-vcinputsapp-600 rounded-full translate-x-1/2 z-10' />
									<div className='md:hidden absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-vcinputsapp-600 rounded-full translate-y-1/2 z-10' />

									<div className='scale-90 sm:scale-100'>
										<Picture
											src={logoImage?.sourceUrl}
											alt='Rummer-logo'
											priority
											loading='lazy'
											className={`!w-[85px] lg:!w-[90px] xl:w-[134px] object-contain hover:scale-105 transition-[.3] hover:animate-pulse`}
										/>
									</div>
								</div>
							</div>

							{/* Connector */}
							<div className='hidden md:block absolute left-[130px] right-[250px] top-0 bottom-0 pointer-events-none'>
								<FlowConnector
									// @ts-ignore
									ref={connectorRef}
								/>
							</div>

							<div className='md:hidden absolute left-1/2 top-[60px] bottom-[240px] -translate-x-1/2 w-0.5 bg-gradient-to-b from-vcinputsapp-600 to-transparent pointer-events-none' />

							{/* Cards Container */}
							<div className='flex md:flex-col flex-row flex-wrap justify-center gap-4 md:gap-5 z-20 w-full max-w-[240px]'>
								{/* Producers Card */}
								<div
									ref={producerCardRef}
									className='bg-vcinputsapp-700 px-3 sm:px-2 py-4 xl:px-6 md:py-5 lg:w-[60%] xl:w-[70%] rounded-lg shadow-md relative md:w-auto w-[calc(50%-8px)]'
								>
									<div
										ref={(el) => {
											if (el) iconsRefs.current[0] = el;
										}}
										className='flex gap-2 md:gap-4 mb-2 md:mb-3 justify-center'
									>
										<div className='bg-white p-2 rounded-lg md:rounded-xl flex items-center justify-center shadow-sm'>
											<Picture
												src={producerLogo1.sourceUrl}
												alt={producerLogo1.altText}
												className='size-6 md:size-8 rounded-lg md:rounded-xl object-cover'
											/>
										</div>
										<div className='bg-vcinputsapp-800 p-2 rounded-lg md:rounded-xl flex items-center justify-center shadow-sm'>
											<Picture
												src={producerLogo2.sourceUrl}
												alt={producerLogo2.altText}
												className='size-6 md:size-8 rounded-lg md:rounded-xl object-cover'
											/>
										</div>
									</div>
									<p className='text-center text-xs md:text-sm font-bold text-gray_1-400 tracking-wide'>
										{rightCard.boxOne.title}
									</p>
								</div>

								{/* Verification Card */}
								<div
									ref={verificationCardRef}
									className='bg-vcinputsapp-1000 px-3 sm:px-2 py-4 xl:px-6 md:py-5 lg:w-[70%] rounded-lg shadow-md relative md:w-auto w-[calc(50%-8px)]'
								>
									<div
										ref={(el) => {
											if (el) iconsRefs.current[1] = el;
										}}
										className='flex gap-2 md:gap-4 mb-2 md:mb-3 justify-center'
									>
										{/* You can use actual verification logos if needed */}
										<div className='bg-vcinputsapp-1100/40 p-2 rounded-lg md:rounded-xl flex items-center justify-center shadow-sm relative'>
											<Picture
												src={verificationLogo1.sourceUrl}
												alt={verificationLogo1.altText}
												className='size-6 md:size-8 rounded-lg md:rounded-xl object-cover'
											/>
										</div>
										<div className='bg-vcinputsapp-1200 p-2 rounded-lg md:rounded-xl flex items-center justify-center shadow-sm relative overflow-hidden'>
											<div className='absolute inset-0 bg-green-500/20 blur-sm'></div>
											<Picture
												src={verificationLogo2.sourceUrl}
												alt={verificationLogo2.altText}
												className='size-6 md:size-8 rounded-lg md:rounded-xl object-cover'
											/>
										</div>
									</div>
									<p className='text-center text-xs md:text-sm font-bold text-gray_1-400 tracking-wide'>
										{rightCard.boxTwo.title}
									</p>
								</div>

								{/* Buyers Card */}
								<div
									ref={buyerCardRef}
									className='bg-vcinputsapp-1300/40 backdrop-blur-md px-3 sm:px-2 py-4 xl:px-6 md:py-5 rounded-lg shadow-md border border-white/10 relative w-full md:w-auto'
								>
									<div
										ref={(el) => {
											if (el) iconsRefs.current[2] = el;
										}}
										className='flex gap-2 md:gap-4 mb-2 md:mb-3 justify-center'
									>
										<div className='bg-vcinputsapp-1500 p-2 rounded-lg md:rounded-lg flex items-center justify-center shadow-sm'>
											<Picture
												src={buyerLogo1.sourceUrl}
												alt={buyerLogo1.altText}
												className='size-6 md:size-8 rounded-lg md:rounded-xl object-cover'
											/>
										</div>
										<div className='bg-vcinputsapp-1600 p-2 rounded-lg md:rounded-lg flex items-center justify-center shadow-sm'>
											<Picture
												src={buyerLogo2.sourceUrl}
												alt={buyerLogo2.altText}
												className='size-6 md:size-8 rounded-lg md:rounded-xl object-cover'
											/>
										</div>
										{/* Optionally add third logo if it exists */}
										{buyerLogo3 && (
											<div className='bg-vcinputsapp-700 p-2 rounded-lg md:rounded-lg flex items-center justify-center shadow-sm'>
												<Picture
													src={buyerLogo3.sourceUrl}
													alt={buyerLogo3.altText}
													className='size-6 md:size-8 rounded-lg md:rounded-xl object-cover'
												/>
											</div>
										)}
									</div>
									<p className='text-center text-xs md:text-sm font-bold text-white tracking-wide'>
										{rightCard.boxThree.title}
									</p>
								</div>
							</div>
						</div>

						{/* Animated background elements */}
						<div className='absolute top-0 left-0 w-full h-full overflow-hidden'>
							<div className='absolute top-1/4 left-1/4 w-32 h-32 bg-vcinputsapp-600/10 rounded-full blur-3xl'></div>
							<div className='absolute bottom-1/4 right-1/4 w-40 h-40 bg-vcinputsapp-700/10 rounded-full blur-3xl'></div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default VCInputsApp;
