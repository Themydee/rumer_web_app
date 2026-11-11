import VCHeroBanner from "@/app/(variantC-home)/_components/VCHeroBanner";
import { RummerLogoShort } from "@/components/utils/functions";
import React from "react";

const AboutHeroSection = () => {
	return (
		<>
			<VCHeroBanner
				badgeIcon={<RummerLogoShort className='' />}
				bgColorIcon='bg-primary-300 !px-2'
				subtitleClassName=''
				title="We are building the digital backbone for Africa's livestock and agricultural trade."
				subtitle="Africa's livestock sector doesn't lack opportunity—it lacks trusted infrastructure. Rumer was founded to close that gap by enabling livestock to be identified, verified and traded with the confidence required for modern commerce."
				buttonText='Get started'
				buttonHref='/partner'
				buttonClassName='bg-yellow-500 hover:bg-yellow-600 text-black-100'
				showCarouselControls={false}
				showGridPattern={true}
				rummerBadge={true}
			/>
		</>
	);
};

export default AboutHeroSection;
