import AppLayoutB from "@/components/global-b/AppLayoutB";
import React from "react";
import { Metadata } from "next";
import ContactHeroSection from "./_components/ContactHeroSection";
import ConnectWithUs from "./_components/ConnectWithUs";
import VCTestimonial from "../(variantC-home)/_components/VCTestimonial";
import VBFAQSection from "../(varaintb-home)/_components/VBFAQSection";
import VBNewsLetterSection from "../(varaintb-home)/_components/VBNewsLetterSection";
import VCJoinTheRummerComponent from "../(variantC-home)/_components/VCJoinTheRummerComponent";
import { SEO_CONFIG, SITE, generateMetadataForPath } from "@/components/reusables/seoConstant";
// import client from "@/components/lib/apollo-client";
// import {
//   GET_Faqs_POSTS,
//   GET_joinTheRumerEarly_POST,
//   GET_Testimonials_POSTS,
// } from "@/components/lib/queries";

const seoConfig = SEO_CONFIG.default;
export const metadata: Metadata = {
	...generateMetadataForPath("/contact-us", {
		title: "Contact Rumer",
		description:
			"Get in touch with the Rumer team. We're here to help with your livestock traceability and trading needs.",
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

	return (
		<AppLayoutB>
			<ContactHeroSection />
			<ConnectWithUs />
			{/* <VCTestimonial testimonialsData={Testimonials} />
			<VBFAQSection Faqs={Faqs} />
			<VCJoinTheRummerComponent joinTheRumerEarlyPost={JoinTheRumerEarlyPost} /> */}
			<VBNewsLetterSection />
		</AppLayoutB>
	);
};

export default page;