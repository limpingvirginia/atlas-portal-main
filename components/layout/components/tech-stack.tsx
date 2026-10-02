const stack = [
  { name: "Next.js", version: "15" },
  { name: "React", version: "19" },
  { name: "Tailwind CSS", version: "4" },
  { name: "TypeScript", version: "5" },
  { name: "shadcn/ui", version: "latest" }
];

export default function TechStack() {
  return (
    <section className="bg-background relative z-10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-8 md:justify-between md:px-6">
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
          Built with
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {stack.map((tech) => (
            <li key={tech.name} className="flex items-baseline gap-1.5">
              <span className="font-heading text-lg">{tech.name}</span>
              <span className="text-muted-foreground font-mono text-xs">{tech.version}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
