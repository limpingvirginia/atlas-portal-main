import { HugeiconsIcon } from "@hugeicons/react";
import {
  Check
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { products } from "@/lib/products";
import type { Purchase } from "@/lib/account";

type Step = {
  title: string;
  description: string;
  done: boolean;
  href?: string;
};

/**
 * Horizontal stepper guiding the customer from purchase to source code.
 * Driven by the most recent purchase. Descriptions collapse on small screens.
 */
export default function GettingStartedTimeline({ purchase }: { purchase: Purchase }) {
  const repo = products.find((p) => p.id === purchase.product_id)?.github_repo;
  if (!repo) return null;

  const steps: Step[] = [
    {
      title: "Purchase completed",
      description: "Your order is confirmed and linked to this account.",
      done: true
    },
    {
      title: "Request GitHub access",
      description: "Click GitHub Access on your product and enter your GitHub username.",
      done: !!purchase.github_status
    },
    {
      title: "Accept the invitation",
      description: "Open the invitation from your GitHub notifications or email and accept it.",
      done: purchase.github_status === "active",
      href:
        purchase.github_status === "pending"
          ? `https://github.com/${repo}/invitations`
          : undefined
    },
    {
      title: "Get the source code",
      description: "Clone the private repository or download it as a zip.",
      done: false
    }
  ];

  const currentStep = steps.findIndex((step) => !step.done);

  return (
    <ol className="bg-muted/30 flex w-full rounded-2xl border p-4 sm:p-6">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCurrent = index === currentStep;
        return (
          <li
            key={step.title}
            className="relative flex flex-1 flex-col items-center gap-2 px-1 text-center sm:px-2">
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-3 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-px",
                  step.done ? "bg-emerald-300" : "bg-border"
                )}
              />
            )}
            <span
              className={cn(
                "z-10 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                step.done
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : isCurrent
                    ? "border-foreground bg-background"
                    : "border-border bg-background text-muted-foreground"
              )}>
              {step.done ? <HugeiconsIcon icon={Check} className="size-3.5 stroke-[3]" /> : index + 1}
            </span>
            <div className="space-y-0.5">
              <p
                className={cn(
                  "text-xs leading-tight sm:text-sm",
                  isCurrent ? "font-semibold" : step.done ? "font-medium" : "text-muted-foreground"
                )}>
                {step.href ? (
                  <a
                    href={step.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2">
                    {step.title} ↗
                  </a>
                ) : (
                  step.title
                )}
              </p>
              <p className="text-muted-foreground mx-auto hidden max-w-[220px] text-xs text-balance md:block">
                {step.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
