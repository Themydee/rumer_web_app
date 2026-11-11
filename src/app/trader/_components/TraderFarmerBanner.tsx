"use client";

import React from "react";
import Picture from "@/components/reusables/Picture";
import { cowImage, manWithCows } from "../../../../public";

const TraderFarmerBanner = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl lg:rounded-[2rem] overflow-hidden">
          <Picture
            src={manWithCows}
            alt="Farmer with cattle in field"
            className="w-full h-64 sm:h-80 lg:h-[400px] xl:h-[480px] object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};

export default TraderFarmerBanner;
