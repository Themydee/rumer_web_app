"use client";
import Picture from "@/components/reusables/Picture";
import React from "react";
import { womenAndGoat } from "../../../../public";

const VCRunnerImg = () => {
  return (
    <div
      className="
        max-w-7xl mx-auto sm:mt-10  p-2
        h-[280px] sm:h-[400px] md:h-[550px] lg:h-[700px] xl:h-[800px]
      ">
      <Picture
        src={womenAndGoat}
        alt="background img"
        className="w-full h-full object-cover rounded-xl"
      />
    </div>
  );
};

export default VCRunnerImg;
