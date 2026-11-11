"use client";

import {
  SpeechBubbleIcon,
  SpeechBubbleTransparent,
} from "@/components/utils/SVGIcons";
import React from "react";

// Chevron Arrow component pointing right

const StoryQuoteBanner = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quote Banner with Chevrons */}
        <div className="relative bg-primary-100 rounded-2xl sm:rounded-3xl py-8 sm:py-10 lg:py-12 h-[200px] overflow-hidden">
          {/* Left chevrons */}
          <div className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 flex items-center">
            <SpeechBubbleIcon className=" fill-white" />
            <SpeechBubbleIcon className=" fill-white -ml-2 sm:-ml-3" />
          </div>

          {/* Middle chevrons */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center">
            <SpeechBubbleIcon className=" fill-white" />
            <SpeechBubbleIcon className=" fill-white -ml-2 sm:-ml-3" />
          </div>

          {/* Right chevrons */}
          <div className="absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 flex items-center">
            <SpeechBubbleIcon className=" fill-white" />
            <SpeechBubbleIcon className=" fill-white -ml-2 sm:-ml-3" />
          </div>

          {/* Quote Text - Centered */}
          <div className="relative z-10 text-center space-y-6">
            <p className="text-lg sm:text-xl lg:text-5xl font-semibold text-white italic">
              Then we took our animals to market.
            </p>
            <p className="text-lg sm:text-xl lg:text-5xl font-semibold text-white italic mt-1">
              And that&apos;s where the real problem showed itself.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryQuoteBanner;
