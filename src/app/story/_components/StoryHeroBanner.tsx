"use client";

import React from "react";
import Picture from "@/components/reusables/Picture";
import { rumerGreenShort, cowImage } from "../../../../public";
import { RiArrowRightLine } from "react-icons/ri";
import VCHeroBanner from "@/app/(variantC-home)/_components/VCHeroBanner";

interface StoryHeroBannerProps {
  marketImage?: any;
}

const StoryHeroBanner = ({ marketImage }: StoryHeroBannerProps) => {
  return (
    <VCHeroBanner
      badgeIcon={
        <Picture
          src={rumerGreenShort}
          alt="Rumer Trader icon"
          className="size-6 object-contain"
        />
      }
      bgColorIcon="bg-primary-300 border border-gray-200"
      badgeText="Rumer Story"
      title=" Born From the Market, Not a Boardroom."
      subtitle="Rumer was built by livestock producers who experienced first-hand how lack of trust, transparency, and proof destroys value in the market. We are building the digital infrastructure that makes quality visible and trust verifiable."
      showCarouselControls={false}
      showGridPattern={true}
      rummerBadge={true}
      rummerBadgeTitle="Rumer's Story"
    />
  );
};

export default StoryHeroBanner;
