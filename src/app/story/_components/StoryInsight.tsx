"use client";

import { BadgeCheckIcon } from "@/components/utils/SVGIcons";
import React from "react";
import { RiArrowRightLine, RiCheckFill } from "react-icons/ri";

interface InsightFeature {
  text: string;
}

const insightFeatures: InsightFeature[] = [
  { text: "Assessor and veterinary-verified supply" },
  { text: "Verified Quality" },
  { text: "Trusted Transactions" },
  { text: "Protected Payments" },
  {
    text: "Shared visibility for farmers, traders, buyers, processors, and regulators.",
  },
];

const badges = ["Traceability", "Ecosystem", "Protected and Secured"];

const StoryInsight = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 ">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-green_1-200 max-w-7xl rounded-lg ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left - Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-black-100">
                The Insight
              </span>
              <RiArrowRightLine className="text-black-100" />
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-black-100 leading-tight">
              The Missing
              <br />
              System of Truth
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-black-200 font-inter font-light max-w-lg leading-relaxed">
              The problem was not farming, trading, or pricing. It was the
              absence of a shared system where ownership, quality, transactions,
              and payments could be verified by everyone in the value chain.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-4">
              {badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green_1-400 flex items-center justify-center">
                    <RiCheckFill className="text-white text-sm" />
                  </div>
                  <span className="text-sm text-black-100 font-medium">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Feature Cards */}
          <div className="space-y-4">
            {insightFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-green_1-400 flex items-center justify-center flex-shrink-0">
                  <BadgeCheckIcon className="text-xs fill-white" />
                </div>
                <span className="text-sm sm:text-base text-black-100 font-medium">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryInsight;
