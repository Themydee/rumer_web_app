"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { features } from "@/components/utils/constants";
import VBFeatureCard from "./VBFeaturedCard";

const MarketplaceFooterSections = () => {
	return (
		<div className='mt-16'>
			{/* Free Delivery Banner */}
			<div className='bg-[#014834] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between'>
				<div>
					<h2 className='text-2xl font-bold text-white mb-2'>Nationwide delivery on all orders</h2>
				</div>
				<Link
					href='/marketplace/shop'
					className='mt-4 md:mt-0 px-6 py-3 bg-white text-[#014834] rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2'
				>
					Shop now
					<ChevronRight className='w-4 h-4' />
				</Link>
			</div>

			{/* Customer Experience Section */}
			<div className='max-w-7xl mx-auto py-12 w-full'>
				<div className='mb-12'>
					<h1 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-2'>We provide the</h1>
					<h2 className='text-3xl sm:text-4xl font-bold text-gray-900'>best customer experiences</h2>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{features.map((feature, index) => (
						<VBFeatureCard
							key={index}
							icon={feature.icon}
							title={feature.title}
							description={feature.description}
						/>
					))}
				</div>
			</div>

			{/* Newsletter Section */}
			<div className='max-w-7xl mx-auto py-12 w-full border-t border-gray-200'>
				<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-8'>
					<div className='max-w-md'>
						<h2 className='text-3xl sm:text-4xl font-bold text-gray-900 leading-tight'>
							Sign up for our newsletter to receive exclusive deals and updates.
						</h2>
					</div>
					<div className='w-full md:w-auto'>
						<p className='text-sm font-medium text-gray-600 mb-3'>Stay connected</p>
						<div className='flex gap-2'>
							<input
								type='email'
								placeholder='Enter Email Address'
								className='flex-1 md:w-64 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014834] focus:border-transparent'
							/>
							<button className='px-6 py-3 bg-[#014834] text-white text-sm font-medium rounded-lg hover:bg-[#013628] transition-colors'>
								Sign Up
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MarketplaceFooterSections;
