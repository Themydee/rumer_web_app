"use client";

import React from "react";
import { RiArrowRightLine, RiCheckFill } from "react-icons/ri";
import Picture from "@/components/reusables/Picture";
import { GroupOfHen } from "../../../../public";

const beliefs = [
  "Effort should be visible.",
  "Quality should be rewarded.",
  "Trust should scale.",
];

const StoryBelief = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-green_1-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          {/* Badge */}
          <div className="flex justify-center mb-4 lg:mb-6">
            <div className="inline-flex items-center gap-2 border border-white/30 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-white">The Impact</span>
              <RiArrowRightLine className="text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight mb-4">
            Built on a Simple Belief
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-white/80 font-inter font-light max-w-2xl mx-auto leading-relaxed">
            We did not build Rumer because livestock is broken. We built it
            because good actors were being failed by a system that could not
            recognise effort, honesty, and quality.
          </p>
        </div>

        {/* Image */}
        <div className="mb-10 lg:mb-14">
          <div className="rounded-2xl lg:rounded-3xl overflow-hidden h-[625px] max-w-[1000px] mx-auto">
            <Picture
              src={GroupOfHen}
              alt="Chickens on farm"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Beliefs */}
        <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10">
          {beliefs.map((belief, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green_1-400  flex items-center justify-center">
                <RiCheckFill className="text-white text-xs" />
              </div>
              <span className="text-sm sm:text-base text-white font-medium">
                {belief}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoryBelief;
