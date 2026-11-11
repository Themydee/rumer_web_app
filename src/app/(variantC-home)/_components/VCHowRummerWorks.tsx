"use client";
import { useEffect, useRef } from "react";
import Picture from "@/components/reusables/Picture";
import { HowRummerWorks, WhyRummerWorks } from "../../../../public";
import {
	BagSvgIcon,
	RecordSvgIcon,
	ShieldSvgIcon,
	SupplySvgIcon,
	TransactionSvgIcon,
} from "@/components/utils/SVGIcons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

interface VCHowRummerWorksProps {
	data: WhyRumerWorksDataType;
}

const VCHowRummerWorks = ({ data }: VCHowRummerWorksProps) => {
	// Map the WordPress data to features array with static icons
	const features = [
		{
			id: 1,
			title: data?.whyRumerWorks?.points1?.title || "Buyers Source with Confidence",
			description: data?.whyRumerWorks?.points1?.description || "Verified livestock moves through an organised supply chain to domestic and international buyers.",
			icon: <BagSvgIcon className='w-6 h-6' />,
			bg: "bg-vchowrummerworks-200",
		},
		{
			id: 2,
			title: "Verified Livestock",
			description: data?.whyRumerWorks?.points2?.description || "On-ground assessors and veterinarians inspect livestock for health, welfare, and quality.",
			icon: <ShieldSvgIcon className='w-6 h-6' />,
			bg: "bg-vchowrummerworks-400",
		},
		{
			id: 3,
			title: "Provenance Records",
			description: data?.whyRumerWorks?.points3?.description || "Key lifecycle events — birth, health, feeding, movement, and sale — are captured as digital records.",
			icon: <RecordSvgIcon className='w-6 h-6' />,
			bg: "bg-vchowrummerworks-600",
		},
		{
			id: 4,
			title: "Aggregated Supply",
			description: data?.whyRumerWorks?.points4?.description || "Producers operate in structured clusters, enabling consistent quality and predictable volumes.",
			icon: <SupplySvgIcon className='w-6 h-6' />,
			bg: "bg-vchowrummerworks-800",
		},
		{
			id: 5,
			title: "Secure Transactions",
			description: data?.whyRumerWorks?.points5?.description || "Buyer payments are held securely in escrow and released only after verification.",
			icon: <TransactionSvgIcon className='w-6 h-6' />,
			bg: "bg-vchowrummerworks-1000",
		},
	];

	// Fallback in case WordPress data is missing
	const fallbackFeatures = [
		{
			id: 1,
			title: "Buyers Source with Confidence",
			description:
				"Verified livestock moves through an organised supply chain to domestic and international buyers.",
			icon: <BagSvgIcon className='w-6 h-6' />,
			bg: "bg-vchowrummerworks-200",
		},
		{
			id: 2,
			title: "Verified Livestock",
			description:
				"On-ground assessors and veterinarians inspect livestock for health, welfare, and quality.",
			icon: <ShieldSvgIcon className='w-6 h-6' />,
			bg: "bg-vchowrummerworks-400",
		},
		{
			id: 3,
			title: "Provenance Records",
			description:
				"Key lifecycle events — birth, health, feeding, movement, and sale — are captured as digital records.",
			icon: <RecordSvgIcon className='w-6 h-6' />,
			bg: "bg-vchowrummerworks-600",
		},
		{
			id: 4,
			title: "Aggregated Supply",
			description:
				"Producers operate in structured clusters, enabling consistent quality and predictable volumes.",
			icon: <SupplySvgIcon className='w-6 h-6' />,
			bg: "bg-vchowrummerworks-800",
		},
		{
			id: 5,
			title: "Secure Transactions",
			description:
				"Buyer payments are held securely in escrow and released only after verification.",
			icon: <TransactionSvgIcon className='w-6 h-6' />,
			bg: "bg-vchowrummerworks-1000",
		},
	];

	// Use WordPress data if available, otherwise use fallback
	const displayFeatures = data?.whyRumerWorks ? features : fallbackFeatures;

	// Refs for GSAP animations
	const sectionRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const featureCardsRef = useRef<(HTMLDivElement | null)[]>([]);
	const imageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Create a master timeline for the section
			const masterTL = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 80%",
					end: "bottom 20%",
					toggleActions: "play none none reverse",
				},
			});

			// Title animation - line by line
			const titleLines = titleRef.current?.querySelectorAll("br");
			const titleText = data?.title || "Why Rumer Works";

			if (titleRef.current) {
				// Use WordPress title if available, otherwise use default
				const titleWords = data?.title
					? data.title.split(" ")
					: ["Why", "Rumer", "Works"];
				titleRef.current.innerHTML = titleWords
					.map(
						(word, index) =>
							`<span class="inline-block opacity-0 translate-y-10">${word}</span>${
								index < titleWords.length - 1 ? "<br/>" : ""
							}`,
					)
					.join("");

				const titleSpans = titleRef.current.querySelectorAll("span");
				gsap.to(titleSpans, {
					y: 0,
					opacity: 1,
					duration: 0.7,
					stagger: 0.15,
					ease: "power2.out",
					scrollTrigger: {
						trigger: titleRef.current,
						start: "top 85%",
					},
				});
			}

			// Feature cards animation - staggered entrance
			featureCardsRef.current.forEach((card, index) => {
				if (!card) return;

				gsap.fromTo(
					card,
					{
						y: 30,
						opacity: 0,
					},
					{
						y: 0,
						opacity: 1,
						duration: 0.6,
						delay: index * 0.1,
						ease: "power2.out",
						scrollTrigger: {
							trigger: card,
							start: "top 85%",
						},
					},
				);

				// Icon animation
				const icon = card.querySelector(".size-12");
				if (icon) {
					gsap.fromTo(
						icon,
						{
							scale: 0,
							rotate: -20,
						},
						{
							scale: 1,
							rotate: 0,
							duration: 0.5,
							delay: index * 0.1 + 0.2,
							ease: "back.out(1.7)",
							scrollTrigger: {
								trigger: card,
								start: "top 85%",
							},
						},
					);
				}

				// Add hover animation
				card.addEventListener("mouseenter", () => {
					gsap.to(card, {
						y: -3,
						duration: 0.2,
						ease: "power2.out",
					});
				});

				card.addEventListener("mouseleave", () => {
					gsap.to(card, {
						y: 0,
						duration: 0.2,
						ease: "power2.out",
					});
				});
			});

			// Image animation (right side)
			if (imageRef.current) {
				gsap.fromTo(
					imageRef.current,
					{
						x: 30,
						opacity: 0,
					},
					{
						x: 0,
						opacity: 1,
						duration: 0.8,
						ease: "power2.out",
						scrollTrigger: {
							trigger: imageRef.current,
							start: "top 85%",
						},
					},
				);

				// Image scale on hover
				const image = imageRef.current.querySelector("img");
				if (image) {
					imageRef.current.addEventListener("mouseenter", () => {
						gsap.to(image, {
							scale: 1.02,
							duration: 0.3,
							ease: "power2.out",
						});
					});

					imageRef.current.addEventListener("mouseleave", () => {
						gsap.to(image, {
							scale: 1,
							duration: 0.3,
							ease: "power2.out",
						});
					});
				}
			}
		});

		return () => ctx.revert();
	}, [data?.title]); // Re-run if title changes

	// Function to get WordPress image URL or fallback to local image
	const getImageSource = () => {
		if (data?.whyRumerWorks?.image?.node?.sourceUrl) {
			return data.whyRumerWorks.image.node.sourceUrl;
		}
		return WhyRummerWorks; // Fallback to local image
	};

	return (
		<div
			ref={sectionRef}
			className='w-full mx-auto md:px-6 pt-3 pb-4 lg:pt-12 lg:pb-32 max-w-6xl px-4'
		>
			<div className='grid lg:grid-cols-12 gap-4 lg:gap-8 items-stretch'>
				<div className='lg:col-span-8'>
					<div className='grid md:grid-cols-2 gap-3 lg:gap-6 h-full'>
						<div className='flex flex-col justify-center p-4 md:p-0'>
							<h2
								ref={titleRef}
								className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl lg:max-w-10 font-medium text-black-100 leading-tight tracking-wide'
							>
								{data?.title || "Why Rumer Works"}
							</h2>
						</div>

						{displayFeatures.map((feature, index) => (
							<div
								key={feature.id}
								ref={(el) => {
									featureCardsRef.current[index] = el;
								}}
								className='border border-gray-950/20 rounded-2xl p-6 flex flex-col items-start hover:shadow-lg transition-shadow duration-300 bg-white transform-gpu'
							>
								<div
									className={`size-12 rounded-full flex items-center justify-center mb-3 lg:mb-6 ${feature.bg}`}
								>
									{feature.icon}
								</div>
								<h3 className='text-lg lg:text-xl font-bold text-black-100 mb-3 font-inter max-w-72'>
									{feature.title}
								</h3>
								<p className='text-black-100 leading-relaxed font-inter text-sm lg:text-base'>
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>

				<div ref={imageRef} className='lg:col-span-4 hidden lg:block'>
					<div className='h-full w-full rounded-[32px] overflow-hidden relative min-h-[600px] group'>
						{data?.whyRumerWorks?.image?.node?.sourceUrl ? (
							// WordPress image
							<Picture
								src={getImageSource()}
								alt={data.whyRumerWorks.image.node.altText || "Why Rumer Works"}
								className='object-cover w-full h-full transform-gpu transition-transform duration-300'
							/>
						) : (
							// Local fallback image
							<Picture
								src={WhyRummerWorks}
								alt='Cattle being herded by farmers'
								className='object-cover w-full h-full transform-gpu transition-transform duration-300'
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default VCHowRummerWorks;
