import Picture from "@/components/reusables/Picture";
import { ArrowRight } from "lucide-react";
import React from "react";
import { rummerWallet } from "../../../../public";

const VCRummerWallet = () => {
  return (
    <div className="max-w-full mx-auto px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center p-0 md:p-8">
        {/* LEFT IMAGE */}
        <div className="relative bg-secondary-500 rounded-xl w-full h-[380px] sm:h-[450px] md:h-[618px] flex justify-center items-center">
          <Picture
            src={rummerWallet}
            alt="Product Image"
            className="w-full h-full object-contain p-6 sm:p-8"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="space-y-8 md:space-y-10 text-center md:text-left w-full">
          <div>
            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-600 inline-block">
              Inputs app
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-snug md:leading-[48px]">
            Contract your livestock and get paid quicker with the Trader App
          </h1>

          {/* Description */}
          <p className="text-black-100 text-base leading-relaxed max-w-md mx-auto md:mx-0">
            Lock in buyers before harvest and get paid faster on your terms with
            livestock contracts. Plus, with seamless funding integration with
            our Money app, you can scale production, improve cash flow, and
            unlock new market opportunities.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center md:justify-start">
            <button className="flex items-center gap-2 bg-black-100 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
              Start Trading
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VCRummerWallet;
