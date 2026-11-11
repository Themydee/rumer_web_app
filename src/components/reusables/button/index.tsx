import { facebookIcon, googleIcon } from "../../../../public";
import { FcGoogle } from "react-icons/fc";
import { FaArrowRight, FaFacebookF } from "react-icons/fa";
import Picture from "../Picture";
import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";

interface ArrowProps {
	className?: string;
	onClick?: () => void;
}

interface GetStartedWelcomeProps {
	title: string;
	description?: string;
	className?: string;
	titleClassName?: string;
	descClassName?: string;
}

export const GetStartedWelcome = ({
	title,
	description,
	className,
	titleClassName,
	descClassName,
}: GetStartedWelcomeProps) => {
	return (
		<div className={`text-center ${className}`}>
			<h1
				className={`text-2xl sm:text-3xl font-medium text-black-100 ${titleClassName}`}
			>
				{title}
			</h1>
			<p
				className={`text-gray-900 font-light mt-2 sm:mt-3 text-sm sm:text-base ${descClassName}`}
			>
				{description}
			</p>
		</div>
	);
};
interface GetStartedLinkProps {
	title?: string;
	className?: string;
}

export const GetStartedLink = ({
	title = "Sign Up",
	className,
}: GetStartedLinkProps) => {
	return (
		<Link
			href="/signup"
			className={`bg-black-100 font-inter w-fit text-white space-x-2 text-sm sm:text-base group font-light px-3 py-3 rounded-lg shadow hover:bg-black-100/80 transition-[.3] flex items-center ${className}`}
		>
			<span className='whitespace-nowrap'>{title}</span>
			<RiArrowRightLine className='group-hover:translate-x-1 transition-[.3] text-lg' />
		</Link>
	);
};

export const SocialLoginButtons = () => {
	return (
		<div className='grid grid-cols-3 gap-3 sm:gap-4 w-full mx-auto'>
			{/* Google Button */}
			<button className='flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow text-xxs lg:text-xs '>
				<Picture
					src={googleIcon}
					alt='googleIcon'
					className='w-4 h-4 sm:w-5 sm:h-5'
				/>
				<span className='font-extralight text-black-100/80'>Google</span>
			</button>

			{/* Facebook Button */}
			<button className='flex-1 flex items-center justify-center gap-2 px-1 lg:px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow text-xxs lg:text-xs'>
				<Picture
					src={facebookIcon}
					alt='facebookIcon'
					className='size-4 sm:size-5'
				/>

				<h4 className='font-extralight text-black-100/80'>Facebook</h4>
			</button>

			{/* Continue as Guest */}
			<button className='flex-1 px-1 lg:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow font-extralight text-black-100/80 text-xxs lg:text-xs'>
				Continue as guest
			</button>
		</div>
	);
};
