"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const MarketplaceContent = dynamic(
  () => import("./_components/VBMarketPlacePage"),
  { ssr: false }
);

const page = () => {
  return (
    <Suspense fallback={null}>
      <MarketplaceContent />
    </Suspense>
  );
};

export default page;
