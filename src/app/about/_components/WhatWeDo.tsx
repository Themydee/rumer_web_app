"use client";
import React from "react";

const WhatWeDo = () => {
  return (
    <section className="bg-white py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Side - Video */}
        <div className="relative rounded-[32px] overflow-hidden w-full h-[400px] md:h-[500px] lg:h-[700px]">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline>
            <source src="/home/whoweareImg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Right Side - Content */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-black-100 font-sf-pro">
            Who are we?
          </h2>

          <div className="flex flex-col gap-6 text-base md:text-lg text-black-300 leading-relaxed font-sf-pro">
            <p>
              Founded to address the deep inefficiencies in how livestock and
              agricultural products move across markets, Rumer exists to
              transform fragmented, informal, and paper-driven supply chains
              into trusted, digital trade ecosystems. Our platform replaces
              opacity with visibility, and uncertainty with clarity using
              verifiable data.
            </p>

            <p>
              By bringing traceability, transparency, and digital trust into
              every stage of the value chain, we enable African producers and
              traders to participate competitively in regional and global
              markets. From local trade routes to international export
              corridors, Rumer connects the entire supply chain on one single,
              intelligent platform.
            </p>

            <p>
              Our vision is simple but powerful: an Africa where livestock and
              agricultural products are trusted by default, valued correctly,
              fairly and traded globally — unlocking wealth, resilience, and
              long-term prosperity for producers and markets alike.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
