"use client";
import React, { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import Picture from "@/components/reusables/Picture";
import { CowWomanImage, gridPattern } from "../../../../public";
import { ProducerHeroIcon } from "@/components/utils/SVGIcons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

const VCHeroServiceBanner = () => {
	// Refs for animation elements
	const sectionRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const iconRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const imageRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Clear initial properties
			gsap.set(
				[
					iconRef.current,
					titleRef.current,
					buttonRef.current,
					imageRef.current,
				],
				{
					opacity: 1,
					y: 0,
					x: 0,
					scale: 1,
				},
			);

			// Background grid pattern animation
			if (gridRef.current) {
				gsap.fromTo(
					gridRef.current,
					{
						opacity: 0,
						scale: 0.8,
						rotation: 10,
					},
					{
						opacity: 0.8,
						scale: 1,
						rotation: 0,
						duration: 2,
						ease: "power3.out",
						scrollTrigger: {
							trigger: sectionRef.current,
							start: "top bottom",
							end: "bottom top",
							scrub: 1,
						},
					},
				);
			}

			// Create main timeline
			const masterTL = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 80%",
					end: "bottom 20%",
					toggleActions: "play none none reverse",
					markers: false,
				},
				defaults: { ease: "power3.out" },
			});

			// Container animation
			masterTL.fromTo(
				containerRef.current,
				{
					y: 100,
					opacity: 0,
					scale: 0.95,
				},
				{
					y: 0,
					opacity: 1,
					scale: 1,
					duration: 1.2,
					ease: "back.out(1.4)",
				},
				0,
			);

			// Icon animation - bounce with rotation
			masterTL.fromTo(
				iconRef.current,
				{
					y: -50,
					opacity: 0,
					scale: 0.5,
					rotation: -180,
				},
				{
					y: 0,
					opacity: 1,
					scale: 1,
					rotation: 0,
					duration: 1,
					ease: "elastic.out(1.2, 0.5)",
				},
				0.2,
			);

			// Title animation - word by word with 3D effect
			if (titleRef.current) {
				const titleText = titleRef.current.textContent || "";
				titleRef.current.innerHTML = "";

				// Split by lines first
				const lines = ["Grow with", "trusted, traceable", "livestock supply"];

				lines.forEach((line, lineIndex) => {
					const lineDiv = document.createElement("div");
					lineDiv.className = "overflow-hidden";
					lineDiv.style.opacity = "0";
					lineDiv.style.transform = "translateY(50px)";

					const lineSpan = document.createElement("span");
					lineSpan.className = "block";
					lineSpan.textContent = line;

					lineDiv.appendChild(lineSpan);
					titleRef.current?.appendChild(lineDiv);

					// Animate each line
					gsap.to(lineDiv, {
						opacity: 1,
						y: 0,
						duration: 1,
						delay: 0.3 + lineIndex * 0.3,
						ease: "power3.out",
						scrollTrigger: {
							trigger: titleRef.current,
							start: "top 85%",
							toggleActions: "play none none reverse",
						},
					});
				});
			}

			// Button animation - slide in with bounce
			masterTL.fromTo(
				buttonRef.current,
				{
					x: -100,
					opacity: 0,
					scale: 0.8,
				},
				{
					x: 0,
					opacity: 1,
					scale: 1,
					duration: 0.8,
					ease: "back.out(1.7)",
				},
				1.2,
			);

			// Image animation - zoom in with parallax
			masterTL.fromTo(
				imageRef.current,
				{
					x: 100,
					opacity: 0,
					scale: 1.2,
					rotationY: 30,
					filter: "blur(10px)",
				},
				{
					x: 0,
					opacity: 1,
					scale: 1,
					rotationY: 0,
					filter: "blur(0px)",
					duration: 1.5,
					ease: "power3.out",
				},
				0.5,
			);

			// Add continuous floating animation to image
			if (imageRef.current) {
				gsap.to(imageRef.current, {
					y: -20,
					duration: 3,
					repeat: -1,
					yoyo: true,
					ease: "sine.inOut",
					scrollTrigger: {
						trigger: imageRef.current,
						start: "top 80%",
						end: "bottom 20%",
						scrub: true,
					},
				});
			}

			// Add hover effect to button
			if (buttonRef.current) {
				const button = buttonRef.current;
				const arrow = button.querySelector("svg");

				button.addEventListener("mouseenter", () => {
					gsap.to(button, {
						scale: 1.05,
						y: -5,
						duration: 0.3,
						ease: "back.out(1.7)",
					});

					if (arrow) {
						gsap.to(arrow, {
							x: 10,
							rotation: 360,
							duration: 0.5,
							ease: "power2.out",
						});
					}
				});

				button.addEventListener("mouseleave", () => {
					gsap.to(button, {
						scale: 1,
						y: 0,
						duration: 0.3,
						ease: "power2.out",
					});

					if (arrow) {
						gsap.to(arrow, {
							x: 0,
							rotation: 0,
							duration: 0.3,
							ease: "power2.out",
						});
					}
				});

				// Click animation
				button.addEventListener("mousedown", () => {
					gsap.to(button, {
						scale: 0.95,
						duration: 0.1,
					});
				});

				button.addEventListener("mouseup", () => {
					gsap.to(button, {
						scale: 1.05,
						duration: 0.1,
					});
				});
			}

			// Add subtle glow to icon
			if (iconRef.current) {
				gsap.to(iconRef.current, {
					boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
					duration: 2,
					repeat: -1,
					yoyo: true,
					ease: "sine.inOut",
				});
			}

			// Add text shadow animation to title
			const titleWords = titleRef.current?.querySelectorAll("div");
			if (titleWords) {
				titleWords.forEach((word, index) => {
					gsap.to(word, {
						textShadow: "0 0 10px rgba(0,0,0,0.3)",
						duration: 2,
						delay: index * 0.5,
						repeat: -1,
						yoyo: true,
						ease: "sine.inOut",
					});
				});
			}
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<div
			ref={sectionRef}
			className='w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-12 lg:py-24 bg-white h-screen grid place-items-center relative overflow-hidden'
		>
			<div
				ref={gridRef}
				className='absolute inset-0 pointer-events-none overflow-hidden opacity-0'
			>
				<Picture
					src={gridPattern}
					className='absolute top-4 left-1/2 transform -translate-x-1/2 opacity-0 sm:opacity-70 lg:opacity-80 lg:-top-10 lg:object-contain lg:w-[1200px]'
					alt=''
				/>
			</div>

			<div
				ref={containerRef}
				className='flex flex-col-reverse gap-4 lg:grid lg:grid-cols-2 sm:gap-12 lg:gap-20 items-center justify-center relative z-10 opacity-0'
			>
				{/* Text Section */}
				<div className='flex flex-col justify-center lg:justify-start items-center lg:items-start space-y-3 xl:space-y-6 order-2 lg:order-1'>
					<div
						ref={iconRef}
						className={`inline-flex items-center p-2 w-fit bg-secondaryTwo-100 rounded-lg shadow-sm opacity-0`}
					>
						<ProducerHeroIcon className='size-6 fill-producerheroicon-100' />
					</div>

					<h1
						ref={titleRef}
						className='text-3xl sm:text-4xl md:text-4xl xl:text-7xl font-light tracking-tight text-center lg:text-start text-black-100 mb-2 lg:leading-loose xl:leading-tight'
					>
						Grow with
						<br />
						trusted, traceable
						<br />
						livestock supply
					</h1>

					<p className='text-vcwhatmakesrummerdifferent-400 text-lg leading-relaxed max-w-lg text-center lg:text-start'>
						Rumer helps livestock producers move from informal trade to
						verified, premium markets.
					</p>

					<button
						ref={buttonRef}
						className='bg-black-100 text-white px-3 py-3 md:px-4 md:py-3 rounded-lg text-sm md:text-base font-extralight hover:bg-primary-100/80 transition-all duration-200 shadow-lg flex items-center gap-2 w-fit group opacity-0'
					>
						Join as a Producer
						<ArrowRight className='w-5 h-5 group-hover:translate-x-2 transition-transform' />
					</button>
				</div>

				{/* Illustration Section */}
				<div className='relative order-1 lg:order-2'>
					<div ref={imageRef} className='rounded-2xl overflow-hidden opacity-0'>
						<Picture
							src={CowWomanImage}
							alt='Farmer milking cow – trusted livestock supply'
							className='w-[70%] mx-auto lg:mx-0 lg:w-full h-auto object-cover transform transition-transform duration-700 hover:scale-105'
						/>
					</div>

					{/* Floating elements overlay */}
					<div className='absolute -top-4 -right-4 w-16 h-16 bg-yellow-400/10 rounded-full blur-xl animate-pulse'></div>
					<div className='absolute -bottom-4 -left-4 w-20 h-20 bg-blue-400/10 rounded-full blur-xl animate-pulse delay-1000'></div>
				</div>
			</div>
		</div>
	);
};

export default VCHeroServiceBanner;
