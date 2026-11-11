"use client";

import React from "react";
import {
	ArrowRight,
	BadgeCheck,
	Check,
	ClipboardList,
	Layout,
	ShieldCheck,
} from "lucide-react";
import {
	BadgeCheckIcon,
	ChecklistIcon,
	ShieldCheckIcon,
} from "@/components/utils/SVGIcons";
import { GetStartedLink } from "@/components/reusables/button";

const WhyRumer = () => {
	const cards = [
		{
			icon: <BadgeCheckIcon className=' fill-white' />,
			text: "Trusted Digital Identity",
		},
		{
			icon: <BadgeCheckIcon className=' fill-white' />,
			text: "End-to-End Traceability",
		},
		{
			icon: <ChecklistIcon className=' fill-white' />,
			text: "Secure Trade Infrastructure",
		},
		{
			icon: <ShieldCheckIcon className=' fill-white' />,
			text: "Built for Scale Across Africa",
		},
	];

	return (
		<section className='w-full bg-gray_1-700 py-16 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20'>
				{/* Left Side: Text Content */}
				<div className='w-full md:w-5/12 flex flex-col items-start text-left'>
					<h2 className='text-4xl md:text-5xl font-normal text-black-100 mb-6'>
						Why Rumer
					</h2>
					<p className='text-base md:text-lg text-black-100 leading-relaxed mb-8 font-inter'>
						Successful markets shouldn&apos;t depend on trust between strangers. They
						should depend on trusted infrastructure. Rumer replaces fragmented
						records, unverifiable identities and disconnected supply chains with
						digital infrastructure that verifies every participant, every asset
						and every transaction—so trust is built into the system, not left to
						chance.
					</p>

					<div className='flex flex-wrap gap-4 mb-8 font-inter'>
						{["Trust by Default", "Trade Without Barriers", "Prosperity at Scale"].map(
							(item, index) => (
								<div key={index} className='flex items-center gap-2'>
									<div className='w-6 h-6 rounded-full bg-green_1-100 flex items-center justify-center'>
										<Check className='w-3.5 h-3.5 text-white' strokeWidth={3} />
									</div>
									<span className='text-black-100 font-medium'>{item}</span>
								</div>
							),
						)}
					</div>

					<GetStartedLink
						title='Get Started'
						className='!text-xs xl:!text-sm !px-2 lg:!px-5'
					/>
				</div>

				{/* Right Side: Cards */}
				<div className='w-full md:w-7/12 items-end flex flex-col gap-4 p-5 font-inter'>
					{cards.map((card, index) => (
						<div
							key={index}
							className='bg-white p-4 rounded-xl shadow-sm flex lg:w-4/5 items-center gap-4 hover:shadow-md transition-shadow'
						>
							<div className='w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-green_1-100 flex items-center justify-center flex-shrink-0'>
								<div>{card.icon}</div>
							</div>
							<p className='text-black-100 text-base lg:text-lg'>{card.text}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default WhyRumer;
