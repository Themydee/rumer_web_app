"use client";

import React from "react";
import Picture from "@/components/reusables/Picture";
import { hensWithNet } from "../../../../public";
import { RiArrowRightLine } from "react-icons/ri";
import { GridIcon } from "@/components/utils/SVGIcons";

interface BeginningFeature {
  icon: React.ReactNode;
  title: string;
}

const beginningFeatures: BeginningFeature[] = [
  {
    icon: <GridIcon />,
    title: "Build an airtight biosecurity plan",
  },
  {
    icon: <GridIcon />,
    title: "We invested in better breeding.",
  },
  {
    icon: <GridIcon />,
    title: "We focused on animal health, proper records, and quality.",
  },
];

const StoryBeginning = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - Title and Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10 lg:mb-14">
          {/* Left - Content */}
          <div className="space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-full">
              <span className="text-sm font-medium text-black-100">
                Our Beginning
              </span>
              <RiArrowRightLine className="text-black-100 text-sm" />
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-black-100 leading-tight">
              It Started in the Fields
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-black-200 font-inter font-light max-w-lg leading-relaxed">
              We built pilot farms, invested in better breeding, focused on
              animal health, and kept proper records. We raised quality
              livestock and followed best practices. Then we took our animals to
              market, expecting quality and effort to be recognised.
            </p>
          </div>

          {/* Right - Image */}
          <div className="relative">
            <div className="rounded-2xl lg:rounded-3xl overflow-hidden">
              <Picture
                src={hensWithNet}
                alt="Chickens on farm"
                className="w-full h-48 sm:h-56 lg:h-64 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section - Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 pt-6 border-t border-gray-200">
          {beginningFeatures.map((feature, index) => (
            <div key={index} className="flex flex-col items-start">
              <div className="mb-4 border border-green_1-100 p-2 rounded-xl">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-black-100">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoryBeginning;
