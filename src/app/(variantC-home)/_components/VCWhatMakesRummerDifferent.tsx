"use client";
import React, { useEffect, useRef, useMemo } from "react";
import {
	ChatCheckIcon,
	CooperativeIcon,
	EndToEndIcon,
	ShieldEscrowIcon,
	StarCheckIcon,
	MarketAccessIcon,
} from "@/components/utils/SVGIcons";
import { RiArrowRightLine } from "react-icons/ri";
import { FaCircleCheck } from "react-icons/fa6";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Picture from "@/components/reusables/Picture";
import Link from "next/link";

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}
interface VCWhatMakesRummerDifferentProps {
	whatMakesRumerDifferPost?: WhatMakesRumerContentType;
	role?: "producer" | "processor" | "buyer" | "partner";
}

const emptyImage = {
	node: { sourceUrl: "", altText: "", mediaDetails: { sizes: [] } },
};

const roleContentMap: Record<
	"producer" | "processor" | "buyer" | "partner",
	WhatMakesRumerContentType["whatMakesRumerDiffer"]
> = {
	producer: {
		title: "What Makes Rumer Different",
		description:
			"Most platforms digitise transactions. Rumer ensures trust through supply chain digitisation.\n\nEvery verified producer, registered animal, completed trade and successful delivery contributes to a growing digital reputation across the livestock value chain.\n\nThat trusted reputation helps businesses access new markets, build stronger commercial relationships and unlock opportunities for finance and growth.",
		points: {
			pointOne: "Traceability",
			pointTwo: "Ecosystem",
			pointThree: "Protected and Secured",
		},
		joinEarlyAccess: {
			title: "Join as a Producer",
			url: "/signup",
		},
		listGroup: {
			listOne: { title: "Track livestock from birth to sale", image: emptyImage },
			listTwo: { title: "Receive veterinary assessments and quality grading", image: emptyImage },
			listThree: { title: "Join producer clusters for better market access", image: emptyImage },
			listFour: { title: "Build verified performance records over time", image: emptyImage },
			listFive: { title: "Cooperative-based aggregation", image: emptyImage },
			listSix: { title: "Get paid securely through escrow-protected transactions", image: emptyImage },
		},
	},
	processor: {
		title: "What Makes Rumer Different",
		description:
			"Most livestock procurement relies on fragmented supply chains, inconsistent quality and limited visibility. Rumer connects processors and exporters to verified producers, trusted digital records and traceable supply chains—making it easier to source with confidence, maintain quality standards and meet domestic and international market requirements.",
		points: {
			pointOne: "Traceability",
			pointTwo: "Quality Assured",
			pointThree: "Secure Transactions",
		},
		joinEarlyAccess: {
			title: "Join as a Processor or Exporter",
			url: "/signup",
		},
		listGroup: {
			listOne: { title: "Source livestock with full provenance records", image: emptyImage },
			listTwo: { title: "Access consistent volumes from organised producer clusters", image: emptyImage },
			listThree: { title: "Reduce rejection risk through standardised grading", image: emptyImage },
			listFour: { title: "Maintain traceability and custody documentation", image: emptyImage },
			listFive: { title: "", image: emptyImage },
			listSix: { title: "", image: emptyImage },
		},
	},
	buyer: {
		title: "What Makes Rumer Different",
		description:
			"Rumer enables consumers, retailers, traders, institutional buyers and international customers to source verified, premium livestock through trusted producer networks, digital traceability and secure transactions.",
		points: {
			pointOne: "Traceability",
			pointTwo: "Verified Producers",
			pointThree: "Secure Transactions",
		},
		joinEarlyAccess: {
			title: "Join as a Buyer",
			url: "/signup",
		},
		listGroup: {
			listOne: { title: "Source livestock with full provenance records", image: emptyImage },
			listTwo: { title: "Source at scale through structured producer clusters", image: emptyImage },
			listThree: { title: "Access premium, traceable, disease-free supply", image: emptyImage },
			listFour: { title: "Reduce transaction risk with escrow-protected payments", image: emptyImage },
			listFive: { title: "", image: emptyImage },
			listSix: { title: "", image: emptyImage },
		},
	},
	partner: {
		title: "What Makes Rumer Different",
		description:
			"Rumer enables financial institutions and insurers to make faster, more informed lending and underwriting decisions through verified data, digital traceability and trusted livestock records, reducing risk while unlocking new opportunities for livestock-backed finance.",
		points: {
			pointOne: "Verified Collateral",
			pointTwo: "Immutable Data",
			pointThree: "Reduced Lending Risk",
		},
		joinEarlyAccess: {
			title: "Partner with Rumer",
			url: "/signup",
		},
		listGroup: {
			listOne: { title: "Access verified livestock performance data", image: emptyImage },
			listTwo: { title: "Assess risk with traceable supply chain records", image: emptyImage },
			listThree: { title: "Monitor financed assets in real time", image: emptyImage },
			listFour: { title: "Lend with confidence through verified collateral", image: emptyImage },
			listFive: { title: "", image: emptyImage },
			listSix: { title: "", image: emptyImage },
		},
	},
};

const fallbackIcons = [
	EndToEndIcon,
	StarCheckIcon,
	MarketAccessIcon,
	ChatCheckIcon,
	CooperativeIcon,
	ShieldEscrowIcon,
];

const VCWhatMakesRummerDifferent = ({
	whatMakesRumerDifferPost,
	role = "producer",
}: VCWhatMakesRummerDifferentProps) => {
	const { title, whatMakesRumerDiffer } = whatMakesRumerDifferPost || {
		id: role,
		title: "What Makes Rumer Different",
		whatMakesRumerDiffer: roleContentMap[role],
	};
	const { description, points, joinEarlyAccess, listGroup } =
		whatMakesRumerDiffer;

	// Transform ListGroup object into an array for mapping
	const cardItems = useMemo(() => {
		return Object.entries(listGroup)
			.filter(([key, item]) => key.startsWith("list") && item.title) // Only include non-empty list items
			.map(([key, item]) => ({
				id: key,
				text: item.title,
				image: item.image?.node?.sourceUrl,
				alt: item.image?.node?.altText,
			}));
	}, [listGroup]);

	// Convert Points object into an array
	const checkPoints = useMemo(() => {
		return [points.pointOne, points.pointTwo, points.pointThree].filter(
			Boolean,
		);
	}, [points]);

	const sectionRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const descriptionRef = useRef<HTMLParagraphElement>(null);
	const tagsRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const masterTL = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 80%",
					toggleActions: "play none none reverse",
				},
			});

			// Title animation
			if (titleRef.current) {
				const text = titleRef.current.innerText;
				titleRef.current.innerHTML = text
					.split(" ")
					.map(
						(word) =>
							`<span class='inline-block opacity-0 translate-y-10 mr-2'>${word}</span>`,
					)
					.join(" ");

				gsap.to(titleRef.current.querySelectorAll("span"), {
					y: 0,
					opacity: 1,
					duration: 0.6,
					stagger: 0.08,
					ease: "power2.out",
				});
			}

			masterTL.fromTo(
				descriptionRef.current,
				{ y: 20, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.7 },
				"-=0.3",
			);

			if (tagsRef.current) {
				gsap.fromTo(
					tagsRef.current.querySelectorAll(".point-item"),
					{ x: -20, opacity: 0 },
					{ x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
				);
			}

			masterTL.fromTo(
				buttonRef.current,
				{ y: 15, opacity: 0, scale: 0.95 },
				{ y: 0, opacity: 1, scale: 1, duration: 0.6 },
				"-=0.4",
			);

			cardsRef.current.forEach((card, index) => {
				if (!card) return;
				gsap.fromTo(
					card,
					{ x: 40, opacity: 0 },
					{
						x: 0,
						opacity: 1,
						duration: 0.6,
						delay: index * 0.08,
						ease: "power2.out",
						scrollTrigger: { trigger: card, start: "top 90%" },
					},
				);
			});
		});
		return () => ctx.revert();
	}, [title]);

	return (
		<div
			ref={sectionRef}
			className='w-full bg-vcwhatmakesrummerdifferent-100 pb-6 pt-8 lg:py-24'
		>
			<div className='max-w-7xl mx-auto px-4 md:px-6'>
				<div className='flex flex-col lg:grid w-full grid-cols-10 gap-y-12 lg:gap-20 items-center'>
					{/* Left Column */}
					<div className='flex flex-col items-start space-y-6 lg:space-y-8 lg:col-span-6'>
						<h2
							ref={titleRef}
							className='text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-semibold text-black-100 leading-tight font-inter'
						>
							{title || "What Makes Rumer Different"}
						</h2>

						<p
							ref={descriptionRef}
							className='text-black-100 text-sm lg:text-lg leading-relaxed font-inter max-w-xl opacity-0'
						>
							{description}
						</p>

						<div
							ref={tagsRef}
							className='flex flex-wrap gap-4 text-black-200 font-medium font-inter text-sm lg:text-base'
						>
							{checkPoints.map((point, idx) => (
								<div key={idx} className='flex items-center gap-2 point-item'>
									<FaCircleCheck className='size-5 lg:size-6 fill-vcwhatmakesrummerdifferent-200 text-white flex-shrink-0' />
									<span>{point}</span>
								</div>
							))}
						</div>

						<div className='relative group/diff-tooltip w-fit' ref={buttonRef}>
							<Link
								href={joinEarlyAccess.url || "/signup"}
								className='bg-black-100 font-inter w-fit text-white space-x-2 text-sm sm:text-base group font-light px-6 py-3 rounded-lg shadow hover:bg-black-100/80 transition-all flex items-center'
							>
								<span className='whitespace-nowrap'>
									{joinEarlyAccess.title}
								</span>
								<RiArrowRightLine className='group-hover:translate-x-1 transition-transform text-lg' />
							</Link>
						</div>
					</div>

					{/* Right Column: Dynamic Cards */}
					<div className='flex flex-col gap-4 lg:col-span-4 w-full'>
					{cardItems.map((card, index) => {
						const FallbackIcon = fallbackIcons[index];
						return (
							<div
								key={card.id}
								ref={(el) => {
									cardsRef.current[index] = el;
								}}
								className='bg-white rounded-xl p-4 flex items-center gap-4 border border-transparent hover:shadow-md transition-all duration-300 transform-gpu group/card'
							>
								<div className='p-1.5 size-12 rounded-lg bg-vcwhatmakesrummerdifferent-300 flex items-center justify-center flex-shrink-0 group-hover/card:scale-110 transition-transform'>
									{card.image ? (
										<Picture
											src={card.image}
											alt={card.alt || ""}
											className='object-contain'
										/>
									) : (
										FallbackIcon && (
											<FallbackIcon className='size-7 text-white' />
										)
									)}
								</div>
								<span className='text-gray-900 font-medium font-inter text-sm sm:text-base'>
									{card.text}
								</span>
							</div>
						);
					})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default VCWhatMakesRummerDifferent;
