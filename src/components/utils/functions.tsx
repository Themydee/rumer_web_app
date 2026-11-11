"use client";
import { useRouter } from "next/navigation";
import { HiArrowLongLeft, HiOutlineChevronLeft } from "react-icons/hi2";
import Picture from "../reusables/Picture";
import Link from "next/link";
import { rumerGreenShort, rummerLogo, rummerLogoGreen } from "../../../public";
import AnimatedText1 from "../text/AnimatedText1";
import { GoChevronRight } from "react-icons/go";

interface BackButtonProps {
	label?: string;
	className?: string;
}

export const BackButton = ({
	label = "Go Back",
	className = "",
}: BackButtonProps) => {
	const router = useRouter();

	return (
		<div className='flex items-center gap-2'>
			<button
				type='button'
				onClick={() => router.back()}
				className={`grid place-items-center border border-gray-800 size-6 sm:size-8 rounded-md bg-black-100 font-medium ${className} group`}
			>
				<HiArrowLongLeft className='group-hover:-translate-x-1 text-base sm:text-lg transition-[.4] text-white' />
			</button>
			<span className='text-xs sm:text-sm text-primary-200'>{label}</span>
		</div>
	);
};
// Format duration (e.g., 0.02 to "1.2 minutes", 0 to "0 hours")
export const formatDuration = (
	duration: number,
	format: "short" | "long" = "short",
): string => {
	if (duration === 0) return format === "short" ? "0s" : "0 seconds";

	const totalSeconds = Math.round(duration * 60); // duration in minutes → seconds
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	const parts: string[] = [];

	if (hours > 0) {
		parts.push(
			format === "short"
				? `${hours}h`
				: `${hours} hour${hours !== 1 ? "s" : ""}`,
		);
	}
	if (minutes > 0) {
		parts.push(
			format === "short"
				? `${minutes}m`
				: `${minutes} minute${minutes !== 1 ? "s" : ""}`,
		);
	}
	if (seconds > 0) {
		parts.push(
			format === "short"
				? `${seconds}s`
				: `${seconds} second${seconds !== 1 ? "s" : ""}`,
		);
	}

	return parts.join(" ");
};

export const isValidImage = (url: string): Promise<boolean> => {
	return new Promise((resolve) => {
		const img = new Image();
		img.src = url;
		img.onload = () => resolve(true);
		img.onerror = () => resolve(false);
	});
};

export const formatDateTimeAlt = (dateString: string) => {
	if (!dateString) return ""; // Handle null/undefined

	const date = new Date(dateString);

	// Check if date is valid
	if (isNaN(date.getTime())) return "Invalid Date";

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const sanitizeHtml = (html: string) => {
	// Basic example - use a proper library like DOMPurify in production
	return html.replace(/<script.*?>.*?<\/script>/gi, "");
};

interface RummerLogoProps {
	className?: string;
	isGreen?: boolean;
}

export const RummerLogo = ({ className, isGreen = false }: RummerLogoProps) => {
	// const logoSource = isDefault ? RummerLogo : RummerLogoWhite;
	return (
		<Link href='/' className={` ${className}`}>
			<Picture
				src={isGreen ? rummerLogoGreen : rummerLogo}
				alt='Rummer-logo'
				priority
				loading='lazy'
				className={`!w-[85px] lg:!w-[90px] xl:w-[134px] object-contain hover:scale-105 transition-[.3] hover:animate-pulse`}
			/>
		</Link>
	);
};

interface RummerLogoShortProps {
	className?: string;
}

export const RummerLogoShort = ({ className }: RummerLogoShortProps) => {
	return (
		<Link href='/' className={` ${className}`}>
			<Picture
				src={rumerGreenShort}
				alt='Rummer-logo'
				priority
				loading='lazy'
				className={`!w-[30px] lg:!w-[32px] xl:w-[33px] object-contain hover:scale-105 transition-[.3] hover:animate-pulse`}
			/>
		</Link>
	);
};

interface BactToArticleProps {
	title: string;
	mainClassName: string;
	textClassName?: string;
}

export const BactToArticle = ({
	title,
	mainClassName,
	textClassName,
}: BactToArticleProps) => {
	return (
		<div className={`space-y-3 w-fit ${mainClassName}`}>
			<Link href='/blog' className='flex items-center gap-0.5 group'>
				<HiOutlineChevronLeft className='text-xl lg:text-3xl group-hover:-translate-x-1 transition-[.4]' />
				<h4 className='text-sm sm:text-base'>Back to Blogs</h4>
			</Link>

			<AnimatedText1
				text={title}
				className={`text-xl sm:text-2xl lg:text-4xl xl:text-5xl ${textClassName}`}
			/>
		</div>
	);
};

interface RumerBadgeProps {
	className?: string;
	title?: string;
}
export const RumerBadge = ({ className, title }: RumerBadgeProps) => {
	return (
		<div
			className={`inline-flex font-inter items-center gap-1 lg:gap-2 border border-gray-600 text-black-100 text-sm xl:text-base font-light px-2 lg:px-4 py-1 lg:py-1.5 rounded-full mb-6 sm:mb-8 ${className}`}
		>
			<span>{title}</span>
			<GoChevronRight className='xl:text-lg' />
		</div>
	);
};

interface RumerBadge2Props {
	className?: string;
	badgeText: string;
}
export const RumerBadge2 = ({ className, badgeText }: RumerBadge2Props) => {
	return (
		<span
			className={`${className} inline-block px-4 py-1.5 bg-primary-300 text-primary-100 text-sm font-medium rounded-lg border border-primary-100`}
		>
			{badgeText}
		</span>
	);
};
