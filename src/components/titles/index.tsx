interface SubtitleProps {
	title: string;
	className?: string;
}

export const SubTitle = ({ title, className }: SubtitleProps) => {
	return (
		<h3
			className={`mt-3 sm:mt-8 text-base text-black-100/70 max-w-3xl xl:text-lg font-normal text-black-100 mx-auto leading-relaxed ${className}`}
		>
			{title}
		</h3>
	);
};

export const MainTitle = ({ title, className }: SubtitleProps) => {
	return (
		<h1
			className={`text-2xl sm:text-4xl xl:text-6xl font-medium text-black-100 mb-4 sm:mb-6 leading-[1.15] ${className}`}
		>
			{title}
		</h1>
	);
};
