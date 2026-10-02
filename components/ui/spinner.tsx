import { HugeiconsIcon } from "@hugeicons/react";
import {
  LoaderCircle as Loader2Icon
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils"

function Spinner({
  className,
  ...props
}: Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon">) {
  return (
    <HugeiconsIcon icon={Loader2Icon} data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
