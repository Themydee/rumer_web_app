"use client";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { isValidImage } from "../utils/functions";
import { rummerLogoGreen } from "../../../public";

interface PictureProps {
	alt: string;
	src: string | StaticImageData;
	width?: number;
	height?: number;
	loading?: "lazy" | "eager" | undefined;
	sizes?: string;
	className?: string;
	priority?: boolean;
	validate?: boolean;
	layout?: "fill" | "fixed" | "intrinsic" | "responsive";
}

const Picture = ({
	src,
	alt,
	width,
	height,
	loading = "lazy",
	sizes,
	layout,
	priority,
	validate,
	className,
}: PictureProps) => {
	const [isValid, setIsValid] = useState<boolean>(true);

	useEffect(() => {
		if (typeof src === "string" && src) {
			const checkImage = async () => {
				const valid = await isValidImage(src);
				setIsValid(valid);
			};
			checkImage();
		}
	}, [src]);

	if (!src || (typeof src === "string" && !src)) {
		return null;
	}

	return (
		<>
			{isValid && typeof src === "string" ? (
				<Image
					src={src}
					alt={alt || "image"}
					width={width || 1800}
					height={height || 1800}
					sizes={sizes || "100vw"}
					loading={loading}
					priority={false}
					layout={layout}
					className={`w-full h-full object-cover ${className || ""}`}
				/>
			) : typeof src !== "string" ? (
				<Image
					src={src}
					alt={alt || "image"}
					width={width || 1800}
					height={height || 1800}
					sizes={sizes || "100vw"}
					loading={loading}
					quality={100}
					priority={false}
					layout={layout}
					className={className || ""}
				/>
			) : (
				validate && (
					<div className='flex flex-col gap-1 items-center justify-center w-full h-[200px] sm:h-full bg-black/50'>
						<div className='relative w-1/2 h-1/2'>
							<Image
								src={rummerLogoGreen}
								alt='Fallback Logo'
								fill
								sizes='100vw'
								style={{ objectFit: "contain" }}
								className='opacity-50 '
							/>
						</div>
						<h5 className='xl capitalize text-white'>Invalid Image</h5>
					</div>
				)
			)}
		</>
	);
};

export default Picture;
