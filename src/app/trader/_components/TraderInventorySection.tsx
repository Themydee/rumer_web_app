"use client";

import React from "react";
import Picture from "@/components/reusables/Picture";
import {
  GroupOfHen,
  featureIcon1,
  featureIcon2,
  featureIcon3,
  hensWithNet,
} from "../../../../public";
import { StaticImageData } from "next/image";

interface FeatureCard {
  icon: StaticImageData;
  title: string;
  description: string;
}

// Dot pattern icon components
// const BlueDotPattern = () => (
//   <div className="grid grid-cols-3 gap-1">
//     {[...Array(9)].map((_, i) => (
//       <div key={i} className="w-2 h-2 rounded-full bg-blue-400" />
//     ))}
//   </div>
// );

// const OrangeDotPattern = () => (
//   <div className="grid grid-cols-2 gap-1.5">
//     {[...Array(4)].map((_, i) => (
//       <div key={i} className="w-2.5 h-2.5 rounded-full bg-orange-400" />
//     ))}
//   </div>
// );

// const GreenDotPattern = () => (
//   <div className="relative w-8 h-8">
//     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-500" />
//     <div className="absolute top-3 left-0 w-2 h-2 rounded-full bg-green-500" />
//     <div className="absolute top-3 right-0 w-2 h-2 rounded-full bg-green-500" />
//     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-500" />
//   </div>
// );

const featureCards: FeatureCard[] = [
  {
    icon: featureIcon1,
    title: "Simple livestock treatment records",
    description:
      "When it comes to compliance, Rumer treatment records ensure you'll breeze through audits.",
  },
  {
    icon: featureIcon2,
    title: "Build an airtight biosecurity plan",
    description:
      "Effective biosecurity measures that meet accreditation standards and safeguard the livestock sector.",
  },
  {
    icon: featureIcon3,
    title: "Increase your market access",
    description:
      "Effortlessly manage the data required to join programs that value your practices and demonstrate compliance.",
  },
];

const TraderInventorySection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - Title and Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10 lg:mb-14">
          {/* Left - Title Content */}
          <div className="space-y-4">
            <span className="inline-block bg-black-100 text-white font-medium px-4 py-1.5 rounded-full text-sm">
              Inventory
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
              This is where smart
              <br />
              farming begins.
            </h2>
            <p className="text-base sm:text-lg text-green-50 font-inter font-light max-w-lg leading-relaxed">
              Never be in the dark with your inventory levels again. Rumer makes
              all your feed, field treatment and livestock medicine available on
              your mobile device.
            </p>
          </div>

          {/* Right - Chicken Image */}
          <div className="relative">
            <div className="rounded-2xl lg:rounded-3xl overflow-hidden">
              <Picture
                src={hensWithNet}
                alt="Chickens in farm"
                className="w-full h-48 sm:h-56 lg:h-64 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section - Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featureCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 sm:mb-6 w-12 h-12 flex items-center justify-center bg-white">
                <Picture
                  src={card.icon}
                  alt={card.title}
                  className="w-full h-full object-cover bg-white"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-primary-100 mb-3">
                {card.title}
              </h3>
              <p className="text-sm sm:text-base text-black-200 font-inter leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TraderInventorySection;
