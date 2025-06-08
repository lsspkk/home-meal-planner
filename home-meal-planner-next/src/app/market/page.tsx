import { Suspense } from "react";
import MarketPageContent from "./MarketPageContent";

export default function MarketPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarketPageContent />
    </Suspense>
  );
} 