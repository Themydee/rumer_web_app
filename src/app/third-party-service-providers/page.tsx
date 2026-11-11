import AppLayoutB from "@/components/global-b/AppLayoutB";
import React from "react";
import { Metadata } from "next";
import VCWhatMakesRummerDifferent from "../(variantC-home)/_components/VCWhatMakesRummerDifferent";
import VCTestimonial from "../(variantC-home)/_components/VCTestimonial";
import VBFAQSection from "../(varaintb-home)/_components/VBFAQSection";
import VBNewsLetterSection from "../(varaintb-home)/_components/VBNewsLetterSection";
import VCJoinTheRummerComponent from "../(variantC-home)/_components/VCJoinTheRummerComponent";
import VCHeroServiceBanner from "../(variantC-home)/_components/VCHeroServiceBanner";
import { SEO_CONFIG, SITE, generateMetadataForPath } from "@/components/reusables/seoConstant";
// import client from "@/components/lib/apollo-client";
// import {
//   GET_Faqs_POSTS,
//   GET_FinancialContent_POST,
//   GET_joinTheRumerEarly_POST,
//   GET_ProductContent_POST,
//   GET_SolutionImages_POSTS,
//   GET_Testimonials_POSTS,
//   GET_whatMakesRumerDiffer_POST,
// } from "@/components/lib/queries";
// import VCHeroBannerProducer from "../producer/_components/VCHeroBannerProducer";

const seoConfig = SEO_CONFIG.default;
export const metadata: Metadata = {
  ...generateMetadataForPath("/third-party-service-providers", {
    title: `${SITE.name} for Service Providers`,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
  }),
};

const page = async () => {
  // const { data: FaqsData } = await client.query<{
  //   faqs: { nodes: FAQPostType[] };
  // }>({
  //   query: GET_Faqs_POSTS,
  //   fetchPolicy: "no-cache",
  // });

  // const Faqs = FaqsData?.faqs.nodes || [];

  // // What Makes Rumer Different
  // const { data: getWhatMakesRumerDifferPost } = await client.query<{
  //   feRumerContent: WhatMakesRumerContentType;
  // }>({
  //   query: GET_whatMakesRumerDiffer_POST,
  //   fetchPolicy: "no-cache",
  // });

  // const WhatMakesRumerDifferPost = getWhatMakesRumerDifferPost?.feRumerContent;

  // //  GET_Testimonials_POSTS
  // const { data: TestimonialsData } = await client.query<{
  //   testimonials: { nodes: TestimonialPostType[] };
  // }>({
  //   query: GET_Testimonials_POSTS,
  //   fetchPolicy: "no-cache",
  // });

  // const Testimonials = TestimonialsData?.testimonials.nodes || [];

  // // What Makes Rumer Different
  // const { data: getJoinTheRumerEarlyPost } = await client.query<{
  //   feRumerContent: JoinTheRumerEarlyContent;
  // }>({
  //   query: GET_joinTheRumerEarly_POST,
  //   fetchPolicy: "no-cache",
  // });

  // const JoinTheRumerEarlyPost = getJoinTheRumerEarlyPost?.feRumerContent;

  // // GET_ProductContent_POST
  // const { data: getFinancialContentPost } = await client.query<{
  //   feRumerContent: ProductContentPostType;
  // }>({
  //   query: GET_FinancialContent_POST,
  //   fetchPolicy: "no-cache",
  // });

  // const ProductContentPost = getFinancialContentPost?.feRumerContent;

  // // solutionImages

  // const { data: SolutionImagesData } = await client.query<{
  //   solutionImages: { edges: { node: SolutionImageNode }[] };
  // }>({
  //   query: GET_SolutionImages_POSTS,
  //   fetchPolicy: "no-cache",
  // });

  // const SolutionImages = SolutionImagesData?.solutionImages.edges || [];

  // // Filter solution images for "financialInstitutions" type
  // const financialInstitutionsSolutionImages = SolutionImages?.filter(
  //   (item) =>
  //     item.node.productImageContent.solutionType === "financialInstitutions",
  // );
  return (
    <AppLayoutB className="mx-auto flex flex-col w-full lg:p-0 lg:pb-32 lg:pt-2">
      {/* <VCHeroBannerProducer
				productContentPost={ProductContentPost}
				solutionImages={financialInstitutionsSolutionImages}
			/>
			<VCWhatMakesRummerDifferent
				whatMakesRumerDifferPost={WhatMakesRumerDifferPost}
			/>
			<VCTestimonial testimonialsData={Testimonials} />
			<VBFAQSection Faqs={Faqs} />
			<VCJoinTheRummerComponent joinTheRumerEarlyPost={JoinTheRumerEarlyPost} /> */}
      <VBNewsLetterSection />
    </AppLayoutB>
  );
};

export default page;
