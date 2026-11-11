import AppLayoutB from "@/components/global-b/AppLayoutB";
import React from "react";
import { Metadata } from "next";
import VBFAQSection from "../(varaintb-home)/_components/VBFAQSection";
import VBNewsLetterSection from "../(varaintb-home)/_components/VBNewsLetterSection";
import { SEO_CONFIG, generateMetadataForPath } from "@/components/reusables/seoConstant";
import VCHeroBannerTrader from "./_components/VCHeroBannerTrader";
import TraderEasySourceSection from "./_components/TraderEasySourceSection";
import TraderInventorySection from "./_components/TraderInventorySection";
import TraderImpactCards from "./_components/TraderImpactCards";
import TraderFarmerBanner from "./_components/TraderFarmerBanner";
import TraderFarmRecords from "./_components/TraderFarmRecords";
import client from "@/components/lib/apollo-client";
import { GET_Faqs_POSTS } from "@/components/lib/queries";

export const dynamic = "force-dynamic";

const seoConfig = SEO_CONFIG.default;
export const metadata: Metadata = {
	...generateMetadataForPath("/trader", {
		title: "Rumer Trader | Access the Power of Our Network",
		description:
			"Make record keeping easy, secure and seamless. Always be prepared for your next audit, and always stay up-to-date – even when you're offline.",
		keywords: seoConfig.keywords,
	}),
};

const page = async () => {
	// Fetch FAQs
	let Faqs: FAQPostType[] = [];
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

	return (
		<AppLayoutB className='mx-auto flex flex-col w-full lg:p-0 lg:pb-32 lg:pt-2'>
			<VCHeroBannerTrader />
			<TraderFarmerBanner />
			<TraderEasySourceSection />
			<TraderImpactCards />
			<TraderInventorySection />
			<TraderFarmRecords />
			<VBFAQSection Faqs={Faqs} />
			<VBNewsLetterSection />
		</AppLayoutB>
	);
};

export default page;
