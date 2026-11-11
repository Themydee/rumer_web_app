import Picture from "@/components/reusables/Picture";
import { ArrowRight } from "lucide-react";
import React from "react";
import { transactionImg } from "../../../../public";

const VCMoneyApp = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
        {/* LEFT SIDE CONTENT */}
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-block">
            <span className="px-3 py-1 bg-white text-black-100 text-xs font-medium rounded border border-gray-300">
              Money app
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-snug md:leading-tight">
            Access multiple funders with a single application
          </h1>

          <p className="text-black-100 text-base leading-relaxed max-w-md mx-auto md:mx-0">
            Quick and seamless production finance application for your growing
            contracts. Apply to all our partners in one go.
          </p>

          {/* CTA BUTTON */}
          <div className="flex justify-center md:justify-start">
            <button className="flex items-center gap-2 bg-black-100 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* FOOTNOTE */}
          <p className="text-sm text-gray-600 pt-2 max-w-sm mx-auto md:mx-0">
            Sellers must meet minimum requirements for funding set by our
            funding partners
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center md:justify-end w-full">
          <Picture
            src={transactionImg}
            alt="Wallet Card"
            className="w-full max-w-xs sm:max-w-sm md:max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default VCMoneyApp;
