import { cn } from "@/lib/utils";

type Props = {
  code: string;
  lang?: string;
  className?: string;
};

export default function CodeRenderer({ code, className }: Props) {
  return (
    <div className={cn("overflow-auto", className)}>
      <pre className="p-4 text-sm text-zinc-100 font-mono leading-relaxed whitespace-pre overflow-x-auto max-h-[500px]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
