import { HugeiconsIcon } from "@hugeicons/react";
import {
  Star
} from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Frontend Developer",
    content:
      "This template saved me weeks of development time. The code quality is exceptional. It reads like something our own team would write.",
    avatar: "/avatars/01.jpeg",
    initials: "SJ"
  },
  {
    name: "Mike Chen",
    role: "Startup Founder",
    content:
      "Perfect for our admin panel. Professional design, easy to customize, and the dark mode looks better than most products I pay for.",
    avatar: "/avatars/02.jpeg",
    initials: "MC"
  },
  {
    name: "Lisa Rodriguez",
    role: "UI/UX Designer",
    content:
      "Beautiful components and great attention to detail. Spacing, typography and states are all consistent. Highly recommended.",
    avatar: "/avatars/03.jpeg",
    initials: "LR"
  }
];

export default function Testimonials() {
  return (
    <section className="bg-background relative z-10">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:py-28">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
              04 · Wall of love
            </p>
            <h2 className="font-heading text-3xl lg:text-4xl">Loved by developers worldwide</h2>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <HugeiconsIcon icon={Star} key={i} className="fill-foreground text-foreground size-4" />
              ))}
            </div>
            <span className="text-muted-foreground font-mono text-xs">4.9/5 from 500+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 border-t border-s md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <figure key={index} className="flex flex-col justify-between gap-6 border-e border-b p-6 lg:p-8">
              <blockquote className="text-base leading-relaxed text-balance">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t pt-5">
                <Avatar className="size-10">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback className="text-xs">{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">{testimonial.name}</div>
                  <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
