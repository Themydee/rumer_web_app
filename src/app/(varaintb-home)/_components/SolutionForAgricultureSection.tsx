"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MainTitle, SubTitle } from "@/components/titles";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { AGRICULTURE_TABS } from "@/components/utils/constants";
import { ArrowRight } from "lucide-react";
import { groupInventoryImg, inventoryImg, ipadGirl } from "../../../../public";
import Picture from "@/components/reusables/Picture";
import { FaArrowRight } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi2";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const SolutionForAgricultureSection = () => {
	const [activeTab, setActiveTab] = useState(AGRICULTURE_TABS[0].id);
	const contentRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const descRef = useRef<HTMLParagraphElement>(null);
	const ctaRef = useRef<HTMLButtonElement>(null);
	const heroImgRef = useRef<HTMLDivElement>(null);
	const benefitsRef = useRef<HTMLDivElement>(null);

	const currentTab = AGRICULTURE_TABS.find((tab) => tab.id === activeTab)!;

	return (
		<section
			id='solutions'
			className='pb-2 sm:py-16 lg:py-20 lg:pt-12 bg-white overflow-hidden'
		>
			<div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
				{/* Top Title */}
				<div className='px-4 lg:px-0'>
					<div className='text-center mb-10 sm:mb-12 lg:mb-16'>
						<MainTitle title="Solutions for Every Player in Africa's Livestock Value Chain" />
						<SubTitle title='We create smart tools that help you plan, manage, and grow from the ground up.' />
					</div>
				</div>

				{/* Tab Navigation */}
				<div className='flex mb-10 sm:mb-12 lg:mb-16'>
					<div className='flex justify-between lg:border-1 lg:border-black-100 text-black-100 lg:rounded-full gap-2 lg:gap-1 text-sm lg:text-base font-medium overflow-x-auto scrollbar-hide px-4 sm:px-0 w-full lg:flex-nowrap mx-auto max-w-max'>
						{AGRICULTURE_TABS.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`px-4 sm:px-6 lg:px-8 py-2 lg:py-2.5 rounded-full transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
									activeTab === tab.id
										? `${tab.bg} text-white shadow-lg`
										: "text-black-100 hover:bg-primary-100/10 bg-gray-50 lg:bg-transparent border border-gray-300 lg:border-0"
								}`}
							>
								{tab.label}
							</button>
						))}
					</div>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-center px-4 sm:px-0'>
					<div className='lg:col-span-8 h-full relative'>
						<div
							ref={contentRef}
							className={`relative ${currentTab?.backgroundColor} rounded-3xl overflow-hidden shadow-xl h-full`}
						>
							<div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-[1]'></div>
							<div className='relative z-10 p-6 sm:p-8 lg:p-12 xl:pr-20 lg:w-1/2'>
								<div className='inline-flex items-center bg-yellow-400 text-black-100 font-medium px-4 sm:px-3 py-2 sm:py-1.5 rounded-full text-xs sm:text-sm mb-4 sm:mb-6'>
									{currentTab.badge}
								</div>

								<h2
									ref={titleRef}
									className='text-2xl sm:text-3xl text-white lg:text-3xl font-semibold tracking-wide leading-tight mb-3 sm:mb-4 max-w-sm'
								>
									{currentTab.title.split(" ").map((word, index, array) => {
										if (
											word === "Management" ||
											word === "Management." ||
											word === "Management,"
										) {
											return (
												<span key={index} className='text-yellowVB-100'>
													{word}{" "}
												</span>
											);
										}
										if (word === "Compliance") {
											return (
												<span key={index} className='text-partnerheroicon-300'>
													{word}{" "}
												</span>
											);
										}
										const yellowWords: any = {
											processors: "Streamline",
											consumers: "Journey",
											financial: "Smarter",
											government: "Data-Driven",
										};
										const baseWord = word.replace(/[.,]/g, "");
										if (baseWord === yellowWords[currentTab.id]) {
											return (
												<span key={index} className='text-yellowVB-100'>
													{word}{" "}
												</span>
											);
										}
										return <span key={index}>{word} </span>;
									})}
								</h2>

								<p
									ref={descRef}
									className='text-sm sm:text-base font-inter font-extralight lg:text-lg text-green-50 mb-6 sm:mb-8 max-w-sm'
								>
									{currentTab.description}
								</p>

								<div className='relative group/cta-tooltip w-fit'>
									{currentTab.link ? (
										<Link href={currentTab.link}>
											<button
												ref={ctaRef}
												className='bg-white text-green-800 font-medium px-3 lg:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-50 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 group text-sm sm:text-base'
											>
												<div className=''>{currentTab.cta}</div>
												<HiArrowRight className='text-sm lg:text-base group-hover:translate-x-1 transition-transform' />
											</button>
										</Link>
									) : (
										<button
											ref={ctaRef}
											className='bg-white text-green-800 font-medium px-3 lg:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-50 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 group text-sm sm:text-base cursor-not-allowed'
										>
											<div className=''>{currentTab.cta}</div>
											<HiArrowRight className='text-sm lg:text-base group-hover:translate-x-1 transition-transform' />
										</button>
									)}
									{!currentTab.link && (
										<span className='absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black-100 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/cta-tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50'>
											Coming Soon
										</span>
									)}
								</div>
							</div>

							{currentTab?.bgHeroImg && (
								<div className='hidden lg:block absolute right-0 lg:right-10 xl:right-16 2xl:right-24 z-0 xl:top-0 bottom-0'>
									{currentTab.heroImage && (
										<Picture
											src={currentTab.heroImage}
											alt='Background'
											className='w-full h-full object-cover object-right'
										/>
									)}
								</div>
							)}
							<div className='lg:hidden relative z-0 w-full h-fit sm:h-80'>
								{currentTab.heroImage && (
									<div className='absolute inset-0 opacity-30'>
										<Picture
											src={currentTab.heroImage}
											alt='Background'
											className='w-full h-full object-cover'
										/>
									</div>
								)}
								{currentTab?.bgHeroImg && (
									<div className='relative w-full h-full'>
										<Picture
											src={currentTab?.bgHeroImg}
											alt='Farmer'
											className='w-full h-full object-cover object-top'
										/>
									</div>
								)}
							</div>

							{currentTab?.bgHeroImg && (
								<div className='hidden lg:block absolute right-0 lg:right-10 xl:right-16 2xl:right-24 z-0 xl:top-0 bottom-0'>
									<Picture
										src={currentTab?.bgHeroImg}
										alt='Farmer'
										className='w-full lg:w-[500px] xl:w-full xl:h-full object-cover object-right'
									/>
								</div>
							)}
						</div>
						{currentTab.curvyImg && (
							<Picture
								src={currentTab.curvyImg}
								alt='Background'
								className='w-full object-contain opacity-10 lg:opacity-35 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
							/>
						)}
					</div>
					<div className='lg:col-span-4 h-full'>
						<div
							ref={benefitsRef}
							className='flex flex-col gap-4 justify-center h-full'
							onMouseEnter={(e) =>
								gsap.to(e.currentTarget, { y: -6, duration: 0.3 })
							}
							onMouseLeave={(e) =>
								gsap.to(e.currentTarget, { y: 0, duration: 0.3 })
							}
						>
							{currentTab.benefits.map((benefit, idx) => (
								<div
									key={idx}
									className={`${benefit.color} rounded-2xl flex flex-col justify-center gap-3 sm:gap-2 p-5 sm:p-6 shadow-sm h-[30%] hover:shadow-md transition-shadow`}
								>
									<div className='flex flex-col gap-y-2 justify-center'>
										{benefit.icon && (
											<div
												className={`p-2 w-fit ${benefit.iconColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}
											>
												<benefit.icon className='size-5 sm:size-7 fill-yellow-500' />
											</div>
										)}
										<div className='flex-1 font-inter'>
											{benefit.title && (
												<h3 className='sm:text-xl font-medium text-black-100/80 mb-1'>
													{benefit.title}
												</h3>
											)}
											{benefit.subtitle && (
												<p className='text-black-100 font-bold text-sm lg:text-xl max-w-[80%]'>
													{benefit.subtitle}
												</p>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SolutionForAgricultureSection;
