"use client";

import React from "react";
import { RiArrowRightLine } from "react-icons/ri";
import Picture from "@/components/reusables/Picture";
import { manWithTablet, womanWithTablet } from "../../../../public";

const StorySolution = () => {
  return (
    <section className="py-0 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] lg:min-h-[500px]">
          {/* Left - Image */}
          <div className="relative h-64 sm:h-80 lg:h-full">
            <Picture
              src={manWithTablet}
              alt="Farmer with tablet"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right - Content */}
          <div className="bg-[#F5F5E8] p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-full w-fit mb-6">
              <span className="text-sm font-medium text-black-100">
                The Solution
              </span>
              <RiArrowRightLine className="text-black-100" />
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-black-100 leading-tight mb-6">
              Why We
              <br />
              Built Rumer
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-black-200 font-inter font-light leading-relaxed">
              Rumer was built to become that shared system of truth. Not just a
              marketplace. Not just a finance tool. Not just a tracking app.
              Rumer is digital infrastructure for livestock trade, designed by
              people who experienced the losses, not just analysed them.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySolution;
