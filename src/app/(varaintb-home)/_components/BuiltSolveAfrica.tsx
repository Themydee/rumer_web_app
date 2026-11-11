"use client";
import Picture from "@/components/reusables/Picture";
import { MainTitle, SubTitle } from "@/components/titles";
import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { butcherImg, sellerBgImg } from "../../../../public";
import { motion } from "framer-motion";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import { SvgUnionIcon } from "@/components/utils/SVGIcons";

const offerings = [
	{
		icon: SvgUnionIcon,
		title: "For Agribusinesses",
		description:
			"Bid farewell to uncertainty and embrace growth with our expert business consulting and investment readiness assistance.",
	},
	{
		icon: SvgUnionIcon,
		title: "For Farmers & Cooperatives",
		description:
			"Access capital, boost your yields, and enter premium markets with our advanced data tools and capacity-building programs.",
	},
	{
		icon: SvgUnionIcon,
		title: "For Investors & Partners",
		description:
			"Minimize investment risks and achieve tangible results through data-informed strategies and clear reporting.",
	},
] as const;

const BuiltSolveAfrica = () => {
	return (
		<section className='py-10 lg:pt-12 bg-white overflow-hidden'>
			<div className='mx-auto'>
				{/* Top Title */}
				<div className='text-center mb-10 lg:mb-16 space-y-3 px-2 lg:px-0'>
					<MainTitle title='Built to solve Africa’s biggest farming challenges' />
					<SubTitle title='We offer a variety of agricultural technology solutions that maximize value for smallholder farmers and stakeholders, promoting food security for Africa and beyond.' />

					<Link
						href=''
						className='bg-primary-100 mx-auto w-fit text-white text-sm font-light px-5 py-3 group rounded-md shadow hover:bg-primary-200 transition flex items-center gap-1'
					>
						<span>Get Started</span>
						{/* <FaArrowRight className='group-hover:translate-x-1 transition-[.4]' /> */}
					</Link>
				</div>

				<Picture
					src={butcherImg}
					alt='Farmers using Rumer platform'
					className='w-full h-[40vh] sm:h-[615px] object-cover object-center'
				/>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 mt-12 px-6 lg:px-8'>
					{offerings.map((item, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7, delay: index * 0.2 }}
							className='group relative'
						>
							{/* Card */}
							<div className='flex flex-col items-start gap-3 px-2 bg-white'>
								{/* Icon + Title */}
								<div className='flex items-center gap-4'>
									<item.icon className='size-5 fill-green-600' />

									<h3 className='text-xl font-bold text-gray-900'>
										{item.title}
									</h3>
								</div>

								{/* Description */}
								<p className='text-black-100/80 leading-relaxed text-base'>
									{item.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default BuiltSolveAfrica;
