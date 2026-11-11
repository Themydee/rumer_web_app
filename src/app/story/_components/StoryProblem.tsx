"use client";

import React from "react";
import { RiArrowRightLine } from "react-icons/ri";
import { featureIcon1, featureIcon2, featureIcon3 } from "../../../../public";
import Picture from "@/components/reusables/Picture";
import { StaticImageData } from "next/image";

interface ProblemCard {
  icon: StaticImageData;
  title: string;
  description: string;
  titleColor: string;
}

// Dot pattern icon components
const BlueDotPattern = () => (
  <div className="grid grid-cols-3 gap-1">
    {[...Array(9)].map((_, i) => (
      <div key={i} className="w-2 h-2 rounded-full bg-blue-400" />
    ))}
  </div>
);

const OrangeDotPattern = () => (
  <div className="grid grid-cols-2 gap-1.5">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="w-2.5 h-2.5 rounded-full bg-orange-400" />
    ))}
  </div>
);

const GreenDotPattern = () => (
  <div className="relative w-8 h-8">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-500" />
    <div className="absolute top-3 left-0 w-2 h-2 rounded-full bg-green-500" />
    <div className="absolute top-3 right-0 w-2 h-2 rounded-full bg-green-500" />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-500" />
  </div>
);

const problemCards: ProblemCard[] = [
  {
    icon: featureIcon1,
    title: "Random Pricing",
    description:
      "Livestock was priced the same regardless of health, breeding, or history.",
    titleColor: "text-primary-100",
  },
  {
    icon: featureIcon2,
    title: "Invisible Quality",
    description:
      "There was no reliable way to prove animal condition or origin",
    titleColor: "text-primary-100",
  },
  {
    icon: featureIcon3,
    title: "Broken Trust",
    description: "Buyers, traders, and processors could not verify claims.",
    titleColor: "text-primary-100",
  },
];

const StoryProblem = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          {/* Badge */}
          <div className="flex justify-center mb-4 lg:mb-6">
            <div className="inline-flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-black-100">
                The Problem
              </span>
              <RiArrowRightLine className="text-black-100" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-black-100 mb-4 leading-tight">
            When Effort Had No Value
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-black-200 font-inter font-light max-w-2xl mx-auto">
            Livestock was priced the same regardless of health, breeding, or
            history.
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ">
          {problemCards.map((card, index) => (
            <div
              key={index}
              className="w-[376px] h-[376px] border border-gray-300 rounded-lg p-6">
              <div className="mb-4 sm:mb-6 w-12 h-12 flex items-center justify-center">
                <Picture src={card.icon} alt="" />
              </div>
              <h3
                className={`text-lg sm:text-xl font-semibold leading-[30px] ${card.titleColor} mb-3`}>
                {card.title}
              </h3>
              <p className="text-sm sm:text-lg text-black-200 font-inter leading-[30px]">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoryProblem;
