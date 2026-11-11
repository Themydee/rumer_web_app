import AppLayoutB from "@/components/global-b/AppLayoutB";
import React from "react";
import AboutHeroSection from "./_components/AboutHeroSection";
import WhatWeDo from "./_components/WhatWeDo";
import OurTrackRecord from "./_components/OurTrackRecord";
import AboutWhatWeDo from "./_components/AboutWhatWeDo";
import Mission from "./_components/Mission";
import Vision from "./_components/Vision";
import WhyRumer from "./_components/WhyRumer";
import VCTestimonial from "../(variantC-home)/_components/VCTestimonial";
import VBFAQSection from "../(varaintb-home)/_components/VBFAQSection";
import VCJoinTheRummerComponent from "../(variantC-home)/_components/VCJoinTheRummerComponent";
import VBNewsLetterSection from "../(varaintb-home)/_components/VBNewsLetterSection";
import { SEO_CONFIG, SITE, generateMetadataForPath } from "@/components/reusables/seoConstant";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

const seoConfig = SEO_CONFIG.home;
export const metadata: Metadata = {
  ...generateMetadataForPath("/about", {
    title: `${SITE.name} | About Us`,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    ogImage: seoConfig.ogImage,
  }),
};

const page = async () => {
	return (
		<AppLayoutB>
			<AboutHeroSection />
			<OurTrackRecord />
			<AboutWhatWeDo />
			<WhatWeDo />
			<Mission />
			<Vision />
			<WhyRumer />
			<VCTestimonial />
			<VBFAQSection />
			<VCJoinTheRummerComponent />
			<VBNewsLetterSection />
		</AppLayoutB>
	);
};

export default page;
