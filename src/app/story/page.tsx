import AppLayoutB from "@/components/global-b/AppLayoutB";
import React from "react";
import { Metadata } from "next";
import VBNewsLetterSection from "../(varaintb-home)/_components/VBNewsLetterSection";
import { SEO_CONFIG, generateMetadataForPath } from "@/components/reusables/seoConstant";
import StoryHeroBanner from "./_components/StoryHeroBanner";
import StoryBeginning from "./_components/StoryBeginning";
import StoryQuoteBanner from "./_components/StoryQuoteBanner";
import StoryProblem from "./_components/StoryProblem";
import StoryFarmBanner from "./_components/StoryFarmBanner";
import StoryInsight from "./_components/StoryInsight";
import StorySolution from "./_components/StorySolution";
import StoryImpact from "./_components/StoryImpact";
import StoryBelief from "./_components/StoryBelief";

export const dynamic = "force-dynamic";

const seoConfig = SEO_CONFIG.default;
export const metadata: Metadata = {
	...generateMetadataForPath("/story", {
		title: "Rumer's Story | Born From the Market, Not a Boardroom",
		description:
			"Rumer was built by livestock producers who experienced first-hand how lack of trust, transparency, and proof destroys value in the market.",
		keywords: seoConfig.keywords,
	}),
};

const page = async () => {
	return (
		<AppLayoutB className='mx-auto flex flex-col w-full lg:p-0 lg:pb-32 lg:pt-2'>
			<StoryHeroBanner />
			<StoryFarmBanner />
			<StoryBeginning />
			<StoryQuoteBanner />
			<StoryProblem />
			<StoryInsight />
			<StorySolution />
			<StoryImpact />
			<StoryBelief />
			<VBNewsLetterSection />
		</AppLayoutB>
	);
};

export default page;
