"use client";

import { TabsTrigger } from "@/components/ui/tabs";
import type { FileEntry } from "@/lib/code";

type Props = {
  file: FileEntry;
  code: string;
};

export default function ComponentCodeTabItem({ file }: Props) {
  return (
    <TabsTrigger
      value={file.name}
      className="dark:data-[state=active]:bg-secondary inline-flex rounded-md border-none text-sm font-normal text-white/50 data-[state=active]:bg-white/15 data-[state=active]:text-white/90!"
    >
      {file.name}
    </TabsTrigger>
  );
}
