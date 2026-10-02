import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { FAQList } from "@/@data/faq";

export default function FAQ() {
  return (
    <section className="bg-background relative z-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:px-6 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:py-28">
        <div>
          <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
            05 · FAQ
          </p>
          <h2 className="font-heading mb-4 text-3xl lg:text-4xl">Questions, answered</h2>
          <p className="text-muted-foreground text-lg text-balance">
            Everything about licenses, access and payments. Missing something? Check the{" "}
            <Link href="/roadmap" className="text-foreground underline underline-offset-4">
              roadmap
            </Link>{" "}
            or the{" "}
            <Link href="/updates" className="text-foreground underline underline-offset-4">
              latest updates
            </Link>
            .
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {FAQList.map(({ question, answer, value }) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger className="text-left text-base hover:no-underline">
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
