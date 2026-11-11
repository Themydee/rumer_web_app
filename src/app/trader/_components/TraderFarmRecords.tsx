"use client";

import React from "react";
import Picture from "@/components/reusables/Picture";
import { hensWithNet } from "../../../../public";

interface FeatureColumn {
  title: string;
  description: string;
}

const features: FeatureColumn[] = [
  {
    title: "Works offline",
    description:
      "No service? No problem! If you need to add a record while you're out in the field and out of service, simply enter in and your new records will automatically sync when you're back in range.",
  },
  {
    title: "Always secure",
    description:
      "Never worry about your data going through the wash, or getting shared without your permission. Records kept in Rumer are secure, reliable, and always owned by you so you'll never stress about losing your farm's most crucial data.",
  },
  {
    title: "Built for the future",
    description:
      "Protect your legacy with secure records that can be easily shared – from one generation to the next, and across every stakeholder who helps your farm thrive.",
  },
];

const TraderFarmRecords = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-primary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight mb-4 lg:mb-6 max-w-4xl mx-auto">
            Your farm records are always safe,
            <br className="hidden sm:block" />
            secure, and accessible
          </h2>
          <p className="text-base sm:text-lg text-green-50/90 font-inter font-light max-w-3xl mx-auto leading-relaxed">
            Easily automate data collection in the yards using your stick reader
            and weighscale hardware, allowing you to make real-time decisions
            with the animals you&apos;re managing.
          </p>
        </div>

        {/* Image Section */}
        <div className="mb-10 lg:mb-14">
          <div className="rounded-2xl lg:rounded-3xl overflow-hidden max-w-4xl mx-auto shadow-2xl">
            <Picture
              src={hensWithNet}
              alt="Chickens feeding on farm"
              className="w-full h-64 sm:h-80 lg:h-[400px] object-cover object-center"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-left">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-green-50/80 font-inter leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TraderFarmRecords;
