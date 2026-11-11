"use client";

import {
  CopyIcon,
  LeafIcon,
  LockIcon,
  PhoneIcon,
  TargetIcon,
  WindowIcon,
} from "@/components/utils/SVGIcons";
import React from "react";
import { RiArrowRightLine } from "react-icons/ri";
import {
  RiShieldLine,
  RiWalletLine,
  RiArrowRightUpLine,
  RiExchangeLine,
  RiPieChartLine,
  RiLinksFill,
} from "react-icons/ri";

interface ImpactCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const impactCards: ImpactCard[] = [
  {
    icon: <LockIcon className=" " />,
    title: "Reduced risk",
    description: "for processors and exporters.",
  },
  {
    icon: <CopyIcon className=" " />,
    title: "Fair payment",
    description: "for farmers based on verified quality.",
  },
  {
    icon: <PhoneIcon className=" " />,
    title: "Confident negotiation",
    description: "for traders.",
  },
  {
    icon: <WindowIcon className=" " />,
    title: "Transparent purchasing",
    description: "for buyers.",
  },
  {
    icon: <TargetIcon className="" />,
    title: "Reliable data",
    description: "for regulators.",
  },
  {
    icon: <LeafIcon className=" " />,
    title: "Built-in trust",
    description: "across the entire supply chain.",
  },
];

const StoryImpact = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          {/* Badge */}
          <div className="flex justify-center mb-4 lg:mb-6">
            <div className="inline-flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-black-100">
                The Impact
              </span>
              <RiArrowRightLine className="text-black-100" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-black-100 leading-tight">
            What Rumer Changes
          </h2>
        </div>

        {/* Impact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {impactCards.map((card, index) => (
            <div
              key={index}
              className="flex flex-col items-start max-w-[300px]">
              <div className="mb-4">{card.icon}</div>
              <p className="text-base sm:text-lg text-black-200 font-inter leading-relaxed">
                <span className="font-semibold text-black-100">
                  {card.title}
                </span>{" "}
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoryImpact;
