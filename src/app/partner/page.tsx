import AppLayoutB from "@/components/global-b/AppLayoutB";
import React from "react";
import { Metadata } from "next";
import VCWhatMakesRummerDifferent from "../(variantC-home)/_components/VCWhatMakesRummerDifferent";
import VCTestimonial from "../(variantC-home)/_components/VCTestimonial";
import VBFAQSection from "../(varaintb-home)/_components/VBFAQSection";
import VBNewsLetterSection from "../(varaintb-home)/_components/VBNewsLetterSection";
import VCJoinTheRummerComponent from "../(variantC-home)/_components/VCJoinTheRummerComponent";
import VCHeroBannerPartner from "./_components/VCHeroBannerPartner";
import SolutionForAgricultureSection from "../(varaintb-home)/_components/SolutionForAgricultureSection";
import { SEO_CONFIG, SITE, generateMetadataForPath } from "@/components/reusables/seoConstant";

const seoConfig = SEO_CONFIG.default;
export const metadata: Metadata = {
  ...generateMetadataForPath("/partner", {
    title: `${SITE.name} for Partners`,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
  }),
};

const partnerTestimonials: TestimonialPostType[] = [
  {
    id: "1",
    databaseId: 1,
    testimonials: {
      content: "Before partnering with Rumer, assessing livestock finance applications relied heavily on manual verification and incomplete records. The future now means, we are able make lending decisions with greater confidence because every application is supported by trusted data, traceability and verified transaction histories.",
      name: "Head of Agricultural Finance",
      location: "Lagos State, Nigeria",
      companyName: "Rumer Partner",
      image: { node: { sourceUrl: "/home/menSellingCows.png", altText: "Head of Agricultural Finance", mediaDetails: { sizes: [] } } },
    },
  },
];

const page = () => {
  return (
    <AppLayoutB className="mx-auto flex flex-col w-full lg:p-0 lg:pb-32 lg:pt-2">
      <VCHeroBannerPartner />
      <SolutionForAgricultureSection />
      <VCWhatMakesRummerDifferent role="partner" />
      <VCTestimonial testimonialsData={partnerTestimonials} />
      <VBFAQSection />
      <VCJoinTheRummerComponent />
      <VBNewsLetterSection />
    </AppLayoutB>
  );
};

export default page;
