"use client";

import dynamic from "next/dynamic";
import React from "react";

const AccountSettingsContent = dynamic(
  () => import("./AccountSettingsContent"),
  { ssr: false }
);

export default function AccountSettingsPage() {
  return <AccountSettingsContent />;
}
