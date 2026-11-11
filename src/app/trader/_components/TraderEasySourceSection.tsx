"use client";

import React from "react";
import { HiArrowRight } from "react-icons/hi2";
import {
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
  HiOutlineDatabase,
} from "react-icons/hi";
import {
  BadgeCheckIcon,
  BagSvgIcon,
  ChecklistIcon,
  GroupChatIcon,
  ShieldCheckIcon,
  SupplySvgIcon,
} from "@/components/utils/SVGIcons";

interface FeatureItem {
  icon: React.ElementType;
  text: string;
}

const features: FeatureItem[] = [
  {
    icon: GroupChatIcon,
    text: "Assess livestock performance using real supply data",
  },
  {
    icon: BadgeCheckIcon,
    text: "Immutable data records, traceable and predictable output.",
  },
  {
    icon: ChecklistIcon,
    text: "Reduce information fraud and default",
  },
  {
    icon: ShieldCheckIcon,
    text: "Access structured, data-driven livestock ecosystems",
  },
];

const TraderEasySourceSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Column - Title and CTA */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-black-100 leading-tight">
              Easily source, trade,
              <br />
              and contract livestocks
            </h2>
            <p className="text-base sm:text-lg text-black-200 font-inter font-light max-w-lg leading-relaxed">
              Ensure you have the stock you require right when you need it
              through dependable delivery. Partner with us to utilize our
              platforms, connect with a wide network of farmers, and enhance
              your impact.
            </p>
            <button className="bg-black-100 text-white px-6 py-3 rounded-lg text-sm font-inter font-medium hover:bg-black-200 transition-colors duration-300 shadow-lg flex items-center gap-2">
              <span>Get Started</span>
              <HiArrowRight className="text-lg" />
            </button>
          </div>

          {/* Right Column - Features List */}
          <div className="space-y-5 lg:pt-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green_1-400 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white fill-white" />
                </div>
                <p className="text-base sm:text-lg text-black-100 font-inter pt-2.5 leading-relaxed">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TraderEasySourceSection;
