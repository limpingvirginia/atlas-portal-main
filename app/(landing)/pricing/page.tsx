"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Check,
  AlertCircleIcon
} from "@hugeicons/core-free-icons";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { usePricingStore, PlanFeature } from "./store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PaddleCheckout from "@/components/paddle-checkout";
import { products } from "@/lib/products";

function App() {
  const { technologies, allData } = usePricingStore();

  const renderFeatureValue = (feature: PlanFeature) => {
    if (!feature.isAvailable) {
      return <div className="bg-border h-1 w-6 rounded"></div>;
    }

    if (feature.featureValue === "true") {
      return (
        <div className="bg-foreground text-background flex size-5 items-center justify-center rounded-full">
          <HugeiconsIcon icon={Check} className="size-3 stroke-3" />
        </div>
      );
    }

    return <span className="text-sm font-semibold">{feature.featureValue}</span>;
  };

  const renderPricingTable = (techId: string) => {
    const data = allData[techId];
    if (!data || data.plans.length === 0) return null;

    const tech = technologies.find((t) => t.id === techId);
    if (!tech) return null;

    const featureNames = data.features[data.plans[0]?.id] || [];

    const renderPlanHeader = (plan: (typeof data.plans)[number]) => {
      const p = products.find((product) => product.id === plan.id);
      return (
        <>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">{plan.name}</h3>
            {plan.isPopular && <Badge variant="outline">Most popular</Badge>}
          </div>
          {/* grow keeps price and button aligned across plans even when
              one description wraps to more lines */}
          <p className="text-muted-foreground grow text-sm">{plan.description}</p>
          {/* The charged amount lives in lib/products (what Paddle bills) —
              never display a price from anywhere else */}
          <div className="flex items-baseline gap-2 py-2">
            <span className="text-4xl font-bold">{p?.price ?? `$${plan.discountedPrice}`}</span>
            <span className="text-muted-foreground text-lg line-through">
              ${plan.originalPrice}
            </span>
            <span className="text-muted-foreground text-sm">VAT included</span>
          </div>
          <PaddleCheckout product_key={p?.id}>
            <Button className="h-11 w-full">Buy Now</Button>
          </PaddleCheckout>
          <p className="text-muted-foreground mt-1 text-center font-mono text-xs tracking-wide uppercase">
            One-time payment
          </p>
        </>
      );
    };

    return (
      <div className="px-4 pb-20">
        {/* Mobile: one stacked card per plan with its own feature list */}
        <div className="space-y-6 md:hidden">
          {data.plans.map((plan) => {
            const planFeatures = data.features[plan.id] || [];
            return (
              <div key={plan.id} className="border">
                <div
                  className={cn(
                    "flex flex-col gap-2 border-b p-6",
                    plan.isPopular && "bg-muted/30"
                  )}>
                  {renderPlanHeader(plan)}
                </div>
                <ul>
                  {featureNames.map((feature, idx) => {
                    const value = planFeatures[idx];
                    return (
                      <li
                        key={feature.id}
                        className="flex min-h-12 items-center justify-between gap-3 border-b px-6 py-2 last:border-b-0">
                        <span className="text-muted-foreground text-sm">
                          {feature.featureName}
                        </span>
                        {value ? renderFeatureValue(value) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Desktop: comparison matrix */}
        <div className="hidden grid-cols-[minmax(220px,1.2fr)_1fr_1fr] border md:grid">
          {/* Plan headers: one grid row, so every column gets the same height */}
          <div className="border-b" />
          {data.plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "flex flex-col gap-2 border-s border-b p-6",
                plan.isPopular && "bg-muted/30"
              )}>
              {renderPlanHeader(plan)}
            </div>
          ))}

          {/* Section bar spanning the full row */}
          <div className="bg-muted/50 flex h-12 items-center border-b px-6">
            <h3 className="text-sm font-semibold">Key Features</h3>
          </div>
          {data.plans.map((plan) => (
            <div key={plan.id} className="bg-muted/50 h-12 border-s border-b" />
          ))}

          {/* Feature rows: label + one value cell per plan, borders stay continuous */}
          {featureNames.map((feature, idx) => {
            const isLastRow = idx === featureNames.length - 1;
            return (
              <Fragment key={feature.id}>
                <div className={cn("flex h-14 items-center px-6", !isLastRow && "border-b")}>
                  <span className="text-muted-foreground flex items-center gap-2 text-sm">
                    {feature.featureName}
                    <Tooltip>
                      <TooltipTrigger>
                        <HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{feature.featureDesc}</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                </div>
                {data.plans.map((plan) => {
                  const value = (data.features[plan.id] || [])[idx];
                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        "flex h-14 items-center justify-center border-s px-6",
                        !isLastRow && "border-b",
                        plan.isPopular && "bg-muted/30"
                      )}>
                      {value ? renderFeatureValue(value) : null}
                    </div>
                  );
                })}
              </Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center lg:py-24">
        <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
          Pricing
        </p>
        <h1 className="font-heading mb-4 text-4xl md:text-5xl">Pay once, own it forever</h1>
        <p className="text-muted-foreground text-lg text-balance">
          Get lifetime access to Shadcn UI Dashboard with our one-time payment plans. No subscriptions,
          no recurring fees.
        </p>
      </div>

      {renderPricingTable("nextjs")}
    </div>
  );
}

export default App;
