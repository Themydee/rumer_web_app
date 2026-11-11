import AppLayoutB from "@/components/global-b/AppLayoutB";
import React from "react";
import { Metadata } from "next";
import VCWhatMakesRummerDifferent from "../(variantC-home)/_components/VCWhatMakesRummerDifferent";
import VCTestimonial from "../(variantC-home)/_components/VCTestimonial";
import VBFAQSection from "../(varaintb-home)/_components/VBFAQSection";
import VCJoinTheRummerComponent from "../(variantC-home)/_components/VCJoinTheRummerComponent";
import VBNewsLetterSection from "../(varaintb-home)/_components/VBNewsLetterSection";
import VCHeroBannerBuyer from "./_components/VCHeroBannerBuyer";
import SolutionForAgricultureSection from "../(varaintb-home)/_components/SolutionForAgricultureSection";
import { SEO_CONFIG, SITE, generateMetadataForPath } from "@/components/reusables/seoConstant";

const seoConfig = SEO_CONFIG.default;
export const metadata: Metadata = {
  ...generateMetadataForPath("/buyer", {
    title: `${SITE.name} for Buyers`,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
  }),
};

const buyerTestimonials: TestimonialPostType[] = [
  {
    id: "1",
    databaseId: 1,
    testimonials: {
      content: "As a mother, feeding my children has always been about trust. With Rumer, I no longer have to wonder where our meat came from or whether it's safe. I can buy with confidence because every purchase is backed by traceability, verified records and trusted producers.",
      name: "Nafisah Yusuf",
      location: "Katsina State, Nigeria",
      companyName: "Rumer Customer",
      image: { node: { sourceUrl: "/home/womanWithGoat.jpg", altText: "Nafisah Yusuf", mediaDetails: { sizes: [] } } },
    },
  },
];

const page = () => {
  return (
    <AppLayoutB className="mx-auto flex flex-col w-full lg:p-0 lg:pb-32 lg:pt-2">
      <VCHeroBannerBuyer />
      <SolutionForAgricultureSection />
      <VCWhatMakesRummerDifferent role="buyer" />
      <VCTestimonial testimonialsData={buyerTestimonials} />
      <VBFAQSection />
      <VCJoinTheRummerComponent />
      <VBNewsLetterSection />
    </AppLayoutB>
  );
};

export default page;
