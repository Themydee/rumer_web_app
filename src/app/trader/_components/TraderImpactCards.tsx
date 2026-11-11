"use client";

import React from "react";
import Picture from "@/components/reusables/Picture";
import {
  womenAndGoat,
  exporterImg,
  sellerImg3,
  womanWithTablet,
  manWithTableWater,
  fisherMan,
} from "../../../../public";

interface ImpactCard {
  image: any;
  title: string;
  description: string;
}

const impactCards: ImpactCard[] = [
  {
    image: womanWithTablet,
    title: "Maximise your impact",
    description:
      "Support and strengthen agricultural ecosystems by empowering farmers, driving sustainability, and fostering long-term growth in the industry.",
  },
  {
    image: manWithTableWater,
    title: "Unlock a powerful network",
    description:
      "Connect with a vast network of farmers, agribusinesses, and industry leaders to build strategic partnerships and drive meaningful change.",
  },
  {
    image: fisherMan,
    title: "Leverage smart farmer management tools",
    description:
      "Gain valuable insights, track progress, and make data-driven decisions with powerful software and AI tools designed to help you manage and scale your initiatives.",
  },
];

const TraderImpactCards = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-green_1-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {impactCards.map((card, index) => (
            <div key={index} className="flex flex-col">
              {/* Image */}
              <div className="rounded-2xl overflow-hidden mb-5 sm:mb-6">
                <Picture
                  src={card.image}
                  alt={card.title}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                />
              </div>

              {/* Content */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl font-semibold text-black-100">
                  {card.title}
                </h3>
                <p className="text-sm sm:text-base text-black-200 font-inter leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TraderImpactCards;
