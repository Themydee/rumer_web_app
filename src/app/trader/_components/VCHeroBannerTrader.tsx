"use client";

import React from "react";
import VCHeroBanner from "@/app/(variantC-home)/_components/VCHeroBanner";
import { RumerBadge } from "@/components/utils/functions";
import { rumerGreenShort } from "../../../../public";
import Picture from "@/components/reusables/Picture";

const VCHeroBannerTrader = () => {
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
      badgeText="Rumer Trader"
      title="Access the power of our network."
      subtitle="Make record keeping easy, secure and seamless. Always be prepared for your next audit, and always stay up-to-date – even when you're offline."
      buttonText="Get Started"
      buttonHref="/signup"
      showCarouselControls={false}
      showGridPattern={true}
      rummerBadgeTitle="Rumer Trader"
      rummerBadge
    />
  );
};

export default VCHeroBannerTrader;
