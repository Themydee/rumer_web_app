import AppLayout from "@/components/AppLayout";
import React from "react";
import client from "@/components/lib/apollo-client";
import AppLayoutB from "@/components/global-b/AppLayoutB";
import VBHomePageContent from "./(varaintb-home)/_components/VBHomePageContent";
import { Metadata } from "next";
import { SEO_CONFIG, generateMetadataForPath } from "@/components/reusables/seoConstant";
import {
	GET_Faqs_POSTS,
	GET_frontViewComponent_POST,
	GET_INTRODUCINGRUMER_POST,
	GET_joinTheRumerEarly_POST,
	GET_Testimonials_POSTS,
	GET_whatMakesRumerDiffer_POST,
	GET_Why_Rumer_Work,
} from "@/components/lib/queries";
import VCHeroSection from "./(variantC-home)/_components/VCHeroSection";
import VCInputsApp from "./(variantC-home)/_components/VCInputsApp";
import SolutionForAgricultureSection from "./(varaintb-home)/_components/SolutionForAgricultureSection";
import VCHowRummerWorks from "./(variantC-home)/_components/VCHowRummerWorks";
import VCWhatMakesRummerDifferent from "./(variantC-home)/_components/VCWhatMakesRummerDifferent";
import VCTestimonial from "./(variantC-home)/_components/VCTestimonial";
import VBFAQSection from "./(varaintb-home)/_components/VBFAQSection";
import VCJoinTheRummerComponent from "./(variantC-home)/_components/VCJoinTheRummerComponent";
import VBNewsLetterSection from "./(varaintb-home)/_components/VBNewsLetterSection";

export const dynamic = "force-dynamic";

const seoConfig = SEO_CONFIG.home;
export const metadata: Metadata = {
	...generateMetadataForPath("/", {
		title: seoConfig.title,
		description: seoConfig.description,
		keywords: seoConfig.keywords,
		ogImage: seoConfig.ogImage,
	}),
};

const page = async () => {
	let WhyRumerWorks: WhyRumerWorksDataType | null = null;
	let Faqs: FAQPostType[] = [];
	let Testimonials: TestimonialPostType[] = [];
	let IntroRumerPost: FeRumerContentType | null = null;
	let WhatMakesRumerDifferPost: WhatMakesRumerContentType | undefined = undefined;
	let JoinTheRumerEarlyPost: JoinTheRumerEarlyContent | undefined = undefined;
	let FrontViewComponentPost: FrontViewComponentContent | undefined = undefined;

	try {
		const { data: whyRumerWorks } = await client.query<{
			post: WhyRumerWorksDataType;
		}>({
			query: GET_Why_Rumer_Work,
			fetchPolicy: "no-cache",
		});

		WhyRumerWorks = whyRumerWorks?.post || null;
	} catch (e) {
		console.warn("Failed to fetch Why Rumer Works data:", e);
	}

	try {
		const { data: FaqsData } = await client.query<{
			faqs: { nodes: FAQPostType[] };
		}>({
			query: GET_Faqs_POSTS,
			fetchPolicy: "no-cache",
		});

		Faqs = FaqsData?.faqs.nodes || [];
	} catch (e) {
		console.warn("Failed to fetch FAQ data:", e);
	}

	try {
		const { data: TestimonialsData } = await client.query<{
			testimonials: { nodes: TestimonialPostType[] };
		}>({
			query: GET_Testimonials_POSTS,
			fetchPolicy: "no-cache",
		});

		Testimonials = TestimonialsData?.testimonials.nodes || [];
	} catch (e) {
		console.warn("Failed to fetch testimonials data:", e);
	}

	try {
		const { data: getIntroRumerPost } = await client.query<{
			feRumerContent: FeRumerContentType;
		}>({
			query: GET_INTRODUCINGRUMER_POST,
			fetchPolicy: "no-cache",
		});

		IntroRumerPost = getIntroRumerPost?.feRumerContent;
	} catch (e) {
		console.warn("Failed to fetch intro Rumer data:", e);
	}

	try {
		const { data: getWhatMakesRumerDifferPost } = await client.query<{
			feRumerContent: WhatMakesRumerContentType;
		}>({
			query: GET_whatMakesRumerDiffer_POST,
			fetchPolicy: "no-cache",
		});

		WhatMakesRumerDifferPost = getWhatMakesRumerDifferPost?.feRumerContent;
	} catch (e) {
		console.warn("Failed to fetch What Makes Rumer Different data:", e);
	}

	try {
		const { data: getJoinTheRumerEarlyPost } = await client.query<{
			feRumerContent: JoinTheRumerEarlyContent;
		}>({
			query: GET_joinTheRumerEarly_POST,
			fetchPolicy: "no-cache",
		});

		JoinTheRumerEarlyPost = getJoinTheRumerEarlyPost?.feRumerContent;
	} catch (e) {
		console.warn("Failed to fetch join early data:", e);
	}

	try {
		const { data: getFrontViewComponentPost } = await client.query<{
			feRumerContent: FrontViewComponentContent;
		}>({
			query: GET_frontViewComponent_POST,
			fetchPolicy: "no-cache",
		});

		FrontViewComponentPost = getFrontViewComponentPost?.feRumerContent;
	} catch (e) {
		console.warn("Failed to fetch front view data:", e);
	}

	return (
		<AppLayoutB className='mx-auto flex flex-col w-full lg:p-0 lg:pb-32'>
			<div className='relative'>
				<VCHeroSection frontViewComponentPost={FrontViewComponentPost!} />
				<VCInputsApp introRumerPost={IntroRumerPost!} />
				<SolutionForAgricultureSection />
				<VCHowRummerWorks data={WhyRumerWorks!} />
			<VCWhatMakesRummerDifferent />
				<VCTestimonial testimonialsData={Testimonials} />
				<VBFAQSection Faqs={Faqs} />
				<VCJoinTheRummerComponent
					joinTheRumerEarlyPost={JoinTheRumerEarlyPost}
				/>
				<VBNewsLetterSection />
			</div>
		</AppLayoutB>
	);
};

export default page;
