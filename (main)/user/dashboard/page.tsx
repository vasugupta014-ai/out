import { MetricCards } from "./_components/metric-cards";
import { Suspense } from "react";

import { PerformanceOverview } from "./_components/performance-overview";
import { SubscriberOverview } from "./_components/subscriber-overview";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <MetricCards />
      <Suspense fallback={<div>Loading Performance Overview...</div>}>
        <PerformanceOverview />
      </Suspense>
      <Suspense fallback={<div>Loading Subscriber Overview...</div>}>
        <SubscriberOverview />
      </Suspense>
    </div>
  );
}
