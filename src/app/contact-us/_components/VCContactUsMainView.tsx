"use client";
import React from "react";
import { Gift } from "lucide-react";
import { RumerBadge } from "@/components/utils/functions";
import { FaCircleCheck } from "react-icons/fa6";
import ContactUsForm from "./ContactUsForm";

const VCContactUsMainView = () => {
  return (
    <section className="py-16 lg:py-32">
      <div className="max-w-[85rem] px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column – Text Content */}
          <div className="text-center lg:text-left">
            <div className="flex w-full justify-center lg:justify-start mb-3">
              <RumerBadge className="mb-1 xl:mb-2" title="Contact Us" />
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium text-black-100 leading-loose mb-6">
              We&apos;re always
              <br />
              available to answer
              <br />
              your questions
            </h2>

            {/* Description */}
            <p className="text-vcwhatmakesrummerdifferent-400 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8 lg:mb-12">
              Get behind the scenes on our process, exciting news, and the
              people making dreams come true for millions of businesses.
            </p>

            {/* Trust Tags */}
            <div className="flex flex-wrap gap-4 text-black-200 font-medium font-inter text-sm lg:text-base">
              <div className="flex items-center gap-2">
                <FaCircleCheck className="size-6 fill-vcwhatmakesrummerdifferent-300 text-white" />
                <span>Traceability</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCircleCheck className="size-6 fill-vcwhatmakesrummerdifferent-300 text-white" />
                <span>Ecosystem</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCircleCheck className="size-6 fill-vcwhatmakesrummerdifferent-300 text-white" />
                <span>Protected and Secured</span>
              </div>
            </div>
          </div>

          {/* <ContactUsForm /> */}
        </div>
      </div>
    </section>
  );
};

export default VCContactUsMainView;
