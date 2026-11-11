import Picture from "@/components/reusables/Picture";
import React from "react";
import SmartFarmingSection from "./SmartFarmingSection";
import SolutionForAgricultureSection from "./SolutionForAgricultureSection";
import VBFAQSection from "./VBFAQSection";
import VBNewsLetterSection from "./VBNewsLetterSection";
import JoinTheFutureSection from "./JoinTheFutureSection";
import WhatOurUsersAreSaying from "./WhatOurUsersAreSaying";
import CountSection from "./CountSection";
import JoinGrowingNetwork from "./JoinGrowingNetwork";
import BuiltSolveAfrica from "./BuiltSolveAfrica";
import { gridPattern } from "../../../../public";
// import client from "@/components/lib/apollo-client";
// import { GET_Faqs_POSTS } from "@/components/lib/queries";

const VBHomePageContent = async () => {
  // const { data: FaqsData } = await client.query<{
  // 	faqs: { nodes: FAQPostType[] };
  // }>({
  // 	query: GET_Faqs_POSTS,
  // 	fetchPolicy: "no-cache",
  // });

  // const Faqs = FaqsData?.faqs.nodes || [];
  return (
    <div className="relative">
      <SmartFarmingSection />
      <SolutionForAgricultureSection />
      <BuiltSolveAfrica />
      <JoinGrowingNetwork />
      <CountSection />
      <WhatOurUsersAreSaying />
      <JoinTheFutureSection />
      {/* <VBFAQSection Faqs={Faqs} /> */}
      <VBNewsLetterSection />
    </div>
  );
};

export default VBHomePageContent;
