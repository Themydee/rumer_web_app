"use client";
import React from "react";
import {
	Check,
	Wallet,
	Lock,
	ShieldCheck,
	User,
	ArrowRight,
} from "lucide-react";
import {
	CelebrationIcon,
	ProvenanceIcon,
	VerifiedIcon,
} from "@/components/utils/SVGIcons";
import Picture from "@/components/reusables/Picture";
import { padlockIcon } from "../../../../public";
import { RummerLogoShort } from "@/components/utils/functions";
import Link from "next/link";

interface VCJoinTheRummerComponentProps {
	joinTheRumerEarlyPost?: JoinTheRumerEarlyContent;
}

const defaultJoinData: JoinTheRumerEarlyContent = {
	id: "1",
	title: "Join the Rumer Early Access Program",
	joinTheRumerEarly: {
		description:
			"Be among the first verified producers and buyers shaping the future of traceable livestock trade.",
		tag: "Early Access Program",
		title: "Join the Rumer Early Access Program",
		points: {
			pointOne: "Early access to listings",
			pointTwo: "Priority matching",
			pointThree: "Better prices / lower fees",
		},
		applyForEarlyAccess: {
			title: "Apply for Early Access",
			url: "/register",
		},
		rightGroup: {
			upCardGroup: {
				amount: 473000,
				rate: "USD",
				rateAmount: 450476,
			},
			downCard: {
				amount: 473838933,
				tag: "Rumer Volume",
			},
			icons: {
				iconOne: { node: { sourceUrl: "", altText: "", mediaDetails: { sizes: [] } } },
				iconTwo: { node: { sourceUrl: "", altText: "", mediaDetails: { sizes: [] } } },
				iconThree: { node: { sourceUrl: "", altText: "", mediaDetails: { sizes: [] } } },
				iconFour: { node: { sourceUrl: "", altText: "", mediaDetails: { sizes: [] } } },
			},
		},
	},
};

const VCJoinTheRummerComponent = ({
	joinTheRumerEarlyPost,
}: VCJoinTheRummerComponentProps) => {
	const {
		id,
		title: mainTitle,
		joinTheRumerEarly: {
			description,
			tag,
			title: joinTitle,
			points: { pointOne, pointTwo, pointThree },
			applyForEarlyAccess: { title: applyTitle, url: applyUrl },
			rightGroup: {
				upCardGroup: { amount: upAmount, rate, rateAmount },
				downCard: { amount: downAmount, tag: walletTag },
				icons: { iconOne, iconTwo, iconThree, iconFour },
			},
		},
	} = joinTheRumerEarlyPost || defaultJoinData;

	// Format currency for display
	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 0,
			maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
		}).format(amount);
	};

	// Format compact currency (e.g., 473.8M)
	const formatCompactCurrency = (amount: number): string => {
		if (amount >= 1000000000) {
			return `₦${(amount / 1000000000).toFixed(1)}B`;
		}
		if (amount >= 1000000) {
			return `₦${(amount / 1000000).toFixed(1)}M`;
		}
		return formatCurrency(amount);
	};

	// Format regular amount without currency symbol for specific displays
	const formatNumber = (amount: number): string => {
		return new Intl.NumberFormat("en-NG").format(amount);
	};

	return (
		<div className='w-full mx-auto xl:rounded-xl xl:max-w-[95%] bg-vcjointherummer-100 py-8 sm:py-12 lg:py-24 overflow-hidden px-4 sm:px-6'>
			<div className='max-w-7xl mx-auto'>
				{/* Mobile View */}
				<div className='lg:hidden space-y-8'>
					<div className='text-center lg:text-left'>
						<div className='inline-block bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold shadow-sm font-inter mb-4'>
							{tag}
						</div>

						<h2 className='text-2xl xl:text-4xl font-bold text-white leading-tight tracking-tight font-inter mb-4'>
							{joinTitle}
						</h2>

						<p className='text-white/90 text-lg leading-relaxed font-inter mb-6'>
							{description}
						</p>
					</div>

					<div className='relative w-full h-[450px] bg-vcjointherummer-500 rounded-2xl border border-vcjointherummer-600 p-4 flex items-center justify-center overflow-hidden'>
						{/* Top Left Card */}
						<div className='absolute top-8 -left-4 bg-vcjointherummer-100 border border-white/10 p-3 rounded-xl shadow-lg min-w-[200px] z-20 transform scale-90'>
							<div className='text-xl font-bold text-vcjointherummer-700 font-inter mb-1'>
								{formatCurrency(upAmount)}
							</div>
							<div className='flex items-center gap-2'>
								<span className='bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5'>
									↑ {rate}%
								</span>
								<span className='text-sm text-white/80 font-medium'>
									{formatCurrency(rateAmount)}
								</span>
							</div>
						</div>

						<div className='relative flex flex-col items-center justify-center z-10 w-full h-full transform scale-90'>
							<div className='absolute h-[50%] w-[1px] border-l-2 border-dashed border-white/30 left-1/2 top-[25%] transform -translate-x-1/2'></div>
							<div className='absolute w-[80%] h-[1px] border-t-2 border-dashed border-white/30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'></div>

							<div className='relative w-full max-w-[300px] h-32 flex items-center justify-center'>
								{/* Icon One */}
								<div className='absolute left-[5%] w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.3)] flex items-center justify-center z-20'>
									<Picture
										src={iconOne.node.sourceUrl}
										alt={iconOne.node.altText || "Icon One"}
										className='w-10 h-10 object-contain'
									/>
								</div>

								<div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#E8F5E9] rounded-xl flex items-center justify-center shadow-xl z-30'>
									<RummerLogoShort className='w-10 h-10 text-vcjointherummer-100' />
								</div>

								{/* Icon Two */}
								<div className='absolute right-[0%] w-[120px] h-[120px] transform translate-y-[-10px] z-40'>
									<Picture
										src={iconTwo.node.sourceUrl}
										alt={iconTwo.node.altText || "Icon Two"}
										className='w-full h-full object-contain drop-shadow-xl'
									/>
								</div>
							</div>
						</div>

						{/* Icon Three */}
						<div className='absolute top-20 right-4 w-12 h-12 rounded-xl border border-yellow-500/30 bg-vcjointherummer-100/40 backdrop-blur-md flex flex-col items-center justify-center shadow-lg z-20 overflow-hidden'>
							<div className='absolute inset-0 bg-yellow-400/10 rounded-xl blur-sm'></div>
							<Picture
								src={iconThree.node.sourceUrl}
								alt={iconThree.node.altText || "Icon Three"}
								className='w-8 h-8 mb-0.5 z-10 object-contain'
							/>
						</div>

						{/* Bottom Left Card - Wallet */}
						<div className='absolute bottom-6 -left-8 bg-vcjointherummer-600 p-4 rounded-xl shadow-2xl w-[280px] h-[130px] z-30 overflow-hidden transform scale-95'>
							<div className='absolute inset-0 opacity-10 p-1 pointer-events-none flex flex-wrap gap-2 overflow-hidden content-start'>
								{[...Array(30)].map((_, i) => (
									<RummerLogoShort
										key={i}
										className='w-4 h-4 text-vcjointherummer-500'
									/>
								))}
							</div>

							<div className='relative flex flex-col justify-end pt-8 z-10 h-full'>
								<div className='flex items-center gap-2 mb-1'>
									<span className='text-xs font-bold text-black font-inter'>
										{walletTag}
									</span>
								</div>

								<div className='text-2xl font-bold text-vcjointherummer-100 font-inter tracking-tight'>
									{formatCompactCurrency(downAmount)}
								</div>
								<div className='text-[10px] text-vcjointherummer-100/70 font-medium'>
									Total value secured
								</div>
							</div>
						</div>
					</div>

					{/* Points List */}
					<div className='space-y-4 font-inter text-white'>
						<div className='flex items-start gap-3'>
							<div className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5'>
								<Check className='w-4 h-4 text-white' />
							</div>
							<span className='text-gray-200'>{pointOne}</span>
						</div>
						<div className='flex items-start gap-3'>
							<div className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5'>
								<Check className='w-4 h-4 text-white' />
							</div>
							<span className='text-gray-200'>{pointTwo}</span>
						</div>
						<div className='flex items-start gap-3'>
							<div className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5'>
								<Check className='w-4 h-4 text-white' />
							</div>
							<span className='text-gray-200'>{pointThree}</span>
						</div>
					</div>

					{/* Apply Button */}
					<a
						href={applyUrl}
						target='_blank'
						rel='noopener noreferrer'
						className='bg-vcjointherummer-200 text-sm text-black-100 px-8 py-3 rounded-md lg:text-base font-semibold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 group w-full no-underline'
					>
						{applyTitle}
						<ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
					</a>
				</div>

				{/* Desktop View */}
				<div className='hidden lg:grid lg:grid-cols-2 gap-12 lg:gap-20 items-center'>
					<div className='flex flex-col items-start space-y-8 z-10'>
						<div className='bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold shadow-sm font-inter'>
							{tag}
						</div>

						<h2 className='text-3xl xl:text-6xl lg:text-4xl font-bold text-white leading-tight tracking-tight font-inter'>
							{joinTitle}
						</h2>
						<p className='text-white/90 text-lg leading-relaxed font-inter max-w-lg'>
							{description}
						</p>

						<div className='flex flex-col space-y-4 font-inter text-white'>
							<div className='flex items-center gap-3'>
								<div className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center'>
									<Check className='w-4 h-4 text-white' />
								</div>
								<span className='text-gray-200'>{pointOne}</span>
							</div>
							<div className='flex items-center gap-3'>
								<div className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center'>
									<Check className='w-4 h-4 text-white' />
								</div>
								<span className='text-gray-200'>{pointTwo}</span>
							</div>
							<div className='flex items-center gap-3'>
								<div className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center'>
									<Check className='w-4 h-4 text-white' />
								</div>
								<span className='text-gray-200'>{pointThree}</span>
							</div>
						</div>

						<Link
							href="/signup"
							className='bg-vcjointherummer-200 text-black px-8 py-3 rounded-md text-sm font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-2 group no-underline'
						>
							{applyTitle}
							<span className='group-hover:translate-x-1 transition-transform'>
								→
							</span>
						</Link>
					</div>

					<div className='relative w-full h-[600px] bg-vcjointherummer-500 rounded-3xl border border-vcjointherummer-600 p-8 flex items-center justify-center overflow-visible'>
						{/* Top Left Card - Desktop */}
						<div className='absolute top-12 -left-16 bg-vcjointherummer-100 border border-white/10 p-5 rounded-xl shadow-lg min-w-[400px] z-20'>
							<div className='text-2xl xl:text-3xl font-bold text-vcjointherummer-700 font-inter mb-2'>
								{formatCurrency(upAmount)}
							</div>
							<div className='flex items-center gap-3'>
								<span className='bg-white text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1'>
									↑ {rate}%
								</span>
								<span className='text-base text-white/80 font-medium'>
									{formatCurrency(rateAmount)}
								</span>
							</div>
						</div>

						<div className='relative flex flex-col items-center justify-center z-10 w-full h-full'>
							<div className='absolute h-[60%] w-[1px] border-l-2 border-dashed border-white/30 left-1/2 top-[20%] transform -translate-x-1/2'></div>

							<div className='absolute w-[60%] h-[1px] border-t-2 border-dashed border-white/30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'></div>

							<div className='relative w-full max-w-lg h-40 flex items-center justify-center'>
								{/* Icon One - Desktop */}
								<div className='absolute left-[10%] w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center justify-center z-20'>
									<Picture
										src={iconOne.node.sourceUrl}
										alt={iconOne.node.altText || "Icon One"}
										className='w-16 h-16 object-contain'
									/>
								</div>

								<div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#E8F5E9] rounded-2xl flex items-center justify-center shadow-2xl z-30'>
									<RummerLogoShort className=' text-vcjointherummer-100' />
								</div>

								{/* Icon Two - Desktop */}
								<div className='absolute right-[5%] w-[180px] h-[180px] transform translate-y-[-20px] z-40'>
									<Picture
										src={iconTwo.node.sourceUrl}
										alt={iconTwo.node.altText || "Icon Two"}
										className='w-full h-full object-contain drop-shadow-2xl'
									/>
								</div>
							</div>
						</div>

						{/* Icon Three - Desktop */}
						<div className='absolute top-28 right-24 w-16 h-16 rounded-2xl border border-yellow-500/30 bg-vcjointherummer-100/40 backdrop-blur-md flex flex-col items-center justify-center shadow-lg z-20 overflow-hidden'>
							<div className='absolute inset-0 bg-yellow-400/10 rounded-2xl blur-sm'></div>
							<Picture
								src={iconThree.node.sourceUrl}
								alt={iconThree.node.altText || "Icon Three"}
								className='w-12 h-12 mb-1 z-10 object-contain'
							/>
						</div>

						{/* Bottom Left Card - Wallet Desktop */}
						<div className='absolute bottom-12 -left-12 bg-vcjointherummer-600 p-6 rounded-2xl shadow-2xl w-[420px] h-[100px] xl:h-[170px] max-w-full z-30 overflow-hidden'>
							<div className='absolute inset-0 opacity-10 p-2 pointer-events-none flex flex-wrap gap-4 overflow-hidden content-start'>
								{[...Array(60)].map((_, i) => (
									<RummerLogoShort
										key={i}
										className='w-6 h-6 text-vcjointherummer-500'
									/>
								))}
							</div>

							<div className='relative flex flex-col justify-end pt-16 z-10'>
								<div className='flex items-center gap-2 mb-1'>
									<span className='text-sm font-bold text-black font-inter'>
										{walletTag}
									</span>
								</div>

								<div className='text-2xl xl:text-4xl font-bold text-vcjointherummer-100 font-inter tracking-tight'>
									{formatCurrency(downAmount)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VCJoinTheRummerComponent;
