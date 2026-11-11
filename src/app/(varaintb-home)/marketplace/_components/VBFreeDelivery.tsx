import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import Picture from "@/components/reusables/Picture";
import { freeDeliveryBag } from "../../../../../public";

const NewsletterSection = () => {
  return (
    <div className="w-full mx-auto  py-2 space-y-12">
      {/* Promo Banner */}
      <div className="relative bg-green-dark-gradient rounded-2xl overflow-hidden p-6 md:p-12 h-[200px] md:h-[250px]">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-20 h-full">
          <div className="text-white max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">
              Nationwide delivery on
            </h2>
            <p className="text-lg md:text-2xl font-semibold">
              all orders
            </p>
          </div>

          <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 md:px-6 py-2 md:py-3 rounded-md transition-colors text-sm md:text-base">
            Shop now
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Shopping bags image on the right */}
        <div className="-translate-y-1/2 ">
          <Picture
            src={freeDeliveryBag}
            alt="Shopping bags"
            className="w-full h-full object-contain opacity-80 md:opacity-100"
          />
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;
