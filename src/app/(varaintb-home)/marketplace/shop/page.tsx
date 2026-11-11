"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const ShopContent = dynamic(
  () => import("./ShopContent"),
  { ssr: false }
);

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
