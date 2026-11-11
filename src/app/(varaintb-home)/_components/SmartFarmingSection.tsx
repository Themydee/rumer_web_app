"use client";
import { RiArrowRightLine } from "react-icons/ri";
import React from "react";
import { GoChevronRight } from "react-icons/go";
import { gridPattern, sellerImg } from "../../../../public";
import { farmCards } from "@/components/utils/constants";
import Picture from "@/components/reusables/Picture";
import { MainTitle, SubTitle } from "@/components/titles";
import { RumerBadge } from "@/components/utils/functions";

const SmartFarmingSection = () => {
  return (
    <section className="pb-16 pt-24 sm:py-20 lg:pb-20 bg-white relative">
      <Picture
        src={gridPattern}
        className="absolute top-4 lg:-top-10 left-1/2 lg:opacity-80 transform -translate-x-1/2 lg:object-contain lg:w-[1200px]"
        alt=""
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <RumerBadge title="Livestock Solution" />

        <MainTitle title="Smart farming kicks off right here" />

        <SubTitle
          className="sm:mt-3"
          title="Trade wisely, secure funding quickly, and expand your horizons with Rumer."
        />

        {/* Cards Grid */}
        <div className="mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 px-8 sm:px-6 lg:px-8">
          {farmCards.map((card, index) => (
            <div
              key={index}
              className={`${card.bg} rounded-3xl px-4 py-6 sm:p-8 lg:px-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group cursor-pointer h-[280px] sm:h-[360px] border border-gray-100 relative overflow-hidden`}>
              <Picture
                src={card.image}
                alt={card.alt}
                className="object-cover absolute bottom-0 right-0 w-[200px] sm:w-[240px] lg:w-[277px] object-center"
              />

              <div className="text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {card.title}
                </h3>
                <p className="text-black-100/80 mb-6 leading-relaxed text-sm sm:text-base">
                  {card.description}
                </p>
                <button className="inline-flex items-center gap-3 bg-primary-100 text-white font-semibold p-2 rounded-full hover:bg-primary-100 transition-all duration-300 group-hover:shadow-lg">
                  <RiArrowRightLine className="text-2xl sm:text-3xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartFarmingSection;
