"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Picture from "@/components/reusables/Picture";
import { trackrecordImg } from "../../../../public";

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

const OurTrackRecord = () => {
	const sectionRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const descRef = useRef<HTMLParagraphElement>(null);
	const statsRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 70%",
					end: "bottom 20%",
					toggleActions: "play none none reverse",
				},
			});

			// Animate Image
			tl.fromTo(
				imageRef.current,
				{
					y: 50,
					opacity: 0,
					scale: 0.95,
				},
				{
					y: 0,
					opacity: 1,
					scale: 1,
					duration: 0.8,
					ease: "power3.out",
				},
			);

			// Animate Title
			tl.fromTo(
				titleRef.current,
				{
					y: 30,
					opacity: 0,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.6,
					ease: "power2.out",
				},
				"-=0.4",
			);

			// Animate Description
			tl.fromTo(
				descRef.current,
				{
					y: 20,
					opacity: 0,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.6,
					ease: "power2.out",
				},
				"-=0.4",
			);

			// Animate Stats Container
			tl.fromTo(
				statsRef.current,
				{
					y: 40,
					opacity: 0,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.8,
					ease: "power2.out",
				},
				"-=0.4",
			);
		});

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			className='w-full bg-white pb-12 md:py-24 px-4 sm:px-6 lg:px-8'
		>
			<div className='max-w-7xl mx-auto'>
				{/* Top Image */}
				<div
					ref={imageRef}
					className='relative w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden mb-7 sm:mb-12 lg:mb-16 shadow-xl'
				>
					<Picture
						src={trackrecordImg}
						alt='Farmers with cattle'
						className='w-full h-full object-cover'
					/>
				</div>

				{/* Content */}
				<div className='text-center max-w-4xl mx-auto mb-8 lg:mb-16'>
					<h2
						ref={titleRef}
						className='text-4xl md:text-5xl lg:text-6xl font-medium text-black-100 mb-6 tracking-tight'
					>
						Our Partners & Endorsements
					</h2>
					<p
						ref={descRef}
						className='text-lg md:text-xl text-black-200 font-inter font-light'
					>
						We create smart tools that help you plan, manage, and grow from the
						ground up.
					</p>
				</div>

				{/* Partners Logos Section */}
				<div
					ref={statsRef}
					className='bg-gray_1-500 rounded-sm sm:rounded-2xl py-8 md:py-12 sm:px-4'
				>
					<div className='grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 items-center'>
						{[
							{ src: "/home/partners/sterling-bank-logo-png_seeklogo-491491.png", alt: "Sterling" },
							{ src: "/home/partners/FCMB_Logo.png", alt: "FCMB" },
							{ src: "/home/partners/leadway-logo.jpeg", alt: "Leadway Assurance" },
							{ src: "/home/partners/oriyon-logo.jpeg", alt: "Oriyon International" },
							{ src: "/home/partners/Federal-Ministry-of-Livestock-Development-FMLD.png", alt: "Federal Ministry of Livestock Development" },
							{ src: "/home/partners/AFDB-logo.jpeg", alt: "AfDB" },
						].map((partner) => (
							<div
								key={partner.alt}
								className='flex items-center justify-center p-4 min-h-[100px]'
							>
								<img
									src={partner.src}
									alt={partner.alt}
									className='max-h-16 max-w-[180px] object-contain'
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default OurTrackRecord;
