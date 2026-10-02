import { HugeiconsIcon } from "@hugeicons/react";
import {
  Check
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PaddleCheckout from "@/components/paddle-checkout";

const licenses = [
  {
    name: "Pro",
    price: "$79",
    description: "For one developer shipping one product at a time.",
    benefits: [
      "1 developer",
      "All components, pages & blocks",
      "Private GitHub repo + zip download",
      "Free updates"
    ],
    productId: "nextjs-starter",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    name: "Premium",
    price: "$199",
    description: "For teams building together, up to 20 members.",
    benefits: [
      "Everything in Pro",
      "Up to 20 team members",
      "Per-member GitHub access",
      "License keys for the whole team"
    ],
    productId: "nextjs-extended",
    buttonVariant: "outline" as const,
    popular: false
  }
];

export default function CTA() {
  return (
    <section className="bg-background relative z-10">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:py-28">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
            06 · Get started
          </p>
          <h2 className="font-heading mb-4 text-3xl lg:text-4xl">Ship your dashboard this week</h2>
          <p className="text-muted-foreground text-lg text-balance">
            Pay once, keep it forever. Start from a codebase that already looks and works the way
            you want it to.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 border-t border-s md:grid-cols-2">
          {licenses.map((license) => (
            <div
              key={license.name}
              className="relative flex flex-col gap-6 border-e border-b p-6 lg:p-8">
              {license.popular && (
                <Badge variant="secondary" className="absolute top-6 right-6 lg:top-8 lg:right-8">
                  Most popular
                </Badge>
              )}
              <div>
                <h3 className="mb-1 font-semibold">{license.name}</h3>
                <p className="text-muted-foreground text-sm">{license.description}</p>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-4xl">{license.price}</span>
                <span className="text-muted-foreground font-mono text-xs uppercase">one-time</span>
              </div>
              <ul className="space-y-2.5">
                {license.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2.5 text-sm">
                    <HugeiconsIcon icon={Check} className="size-4 shrink-0 stroke-[2.5]" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <PaddleCheckout product_key={license.productId} className="mt-auto">
                <Button size="lg" variant={license.buttonVariant} className="w-full">
                  Buy Now
                </Button>
              </PaddleCheckout>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground mt-6 text-center font-mono text-xs tracking-wide uppercase">
          One-time payment · VAT included · Secure checkout by Paddle · Instant access
        </p>
      </div>
    </section>
  );
}
