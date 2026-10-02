import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

type BlockListItemProps = {
  href: string;
  title: string;
  countText: string;
  isNew?: boolean;
  image: string;
};

export default function BlockListItem({
  href,
  title,
  countText,
  isNew,
  image
}: BlockListItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group bg-card hover:border-primary/50 flex flex-col gap-3 overflow-hidden rounded-lg border p-0 transition-colors hover:shadow-sm"
      )}>
      <div className="bg-muted/50 flex aspect-video w-full items-center justify-center overflow-hidden border-b">
        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          className="w-full object-cover dark:hidden"
        />
        <Image
          src={`${image.replace(".png", "-dark.png")}`}
          alt={title}
          width={500}
          height={500}
          className="hidden w-full object-cover dark:block"
        />
      </div>
      <div className="flex items-center justify-between px-3 pb-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm leading-tight font-medium">{title}</span>
          <span className="text-muted-foreground text-xs">{countText}</span>
        </div>
        {isNew && (
          <Badge
            variant="outline"
            className="border-green-300 bg-green-50 text-[10px] tracking-widest text-green-600 uppercase dark:border-green-800 dark:bg-green-950 dark:text-green-400">
            New
          </Badge>
        )}
      </div>
    </Link>
  );
}
