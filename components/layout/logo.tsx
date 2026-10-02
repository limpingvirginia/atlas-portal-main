import Image from "next/image";
import * as React from "react";
import Link from "next/link";

interface Props extends Omit<React.ComponentProps<typeof Link>, "href"> {
  href?: string;
  className?: string;
}

export default function Logo(props: Props) {
  return (
    <Link href="/" {...props}>
      <Image
        src="/logo.png"
        alt="Shadcn UI Dashboard dashboard template logo"
        width={28}
        height={28}
        className="size-6 rounded-sm"
      />
      <span className="text-base font-medium">Shadcn UI Dashboard</span>
    </Link>
  );
}
