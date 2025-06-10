import { Suspense } from "react";
import MarketPageContent from "./MarketPageContent";
import React from "react";

export default function MarketPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarketPageContent />
    </Suspense>
  );
} 