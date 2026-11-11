import React from "react";
import { Metadata } from "next";
import AppLayoutB from "@/components/global-b/AppLayoutB";
import VCWhatMakesRummerDifferent from "../(variantC-home)/_components/VCWhatMakesRummerDifferent";
import VCTestimonial from "../(variantC-home)/_components/VCTestimonial";
import VBFAQSection from "../(varaintb-home)/_components/VBFAQSection";
import VCJoinTheRummerComponent from "../(variantC-home)/_components/VCJoinTheRummerComponent";
import VBNewsLetterSection from "../(varaintb-home)/_components/VBNewsLetterSection";
import { SEO_CONFIG, SITE, generateMetadataForPath } from "@/components/reusables/seoConstant";
import VCHeroBannerProducer from "./_components/VCHeroBannerProducer";
import SolutionForAgricultureSection from "../(varaintb-home)/_components/SolutionForAgricultureSection";

export const dynamic = "force-dynamic";

const seoConfig = SEO_CONFIG.default;
export const metadata: Metadata = {
	...generateMetadataForPath("/producer", {
		title: `${SITE.name} for Producers`,
		description: seoConfig.description,
		keywords: seoConfig.keywords,
	}),
};

const page = () => {
	return (
		<AppLayoutB className='mx-auto flex flex-col w-full lg:p-0 lg:pb-32 lg:pt-2'>
			<VCHeroBannerProducer />
			<SolutionForAgricultureSection />
			<VCWhatMakesRummerDifferent />
			<VCTestimonial />
			<VBFAQSection />
			<VCJoinTheRummerComponent />
			<VBNewsLetterSection />
		</AppLayoutB>
	);
};

export default page;
