"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Palette as PaletteIcon
} from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { listThemes, type ThemeSave } from "@/app/generator/lib/theme-saves";
import { useBlockThemeStore } from "@/store/block-theme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BlockThemeSelector() {
  const [themes, setThemes] = useState<ThemeSave[]>([]);
  const setPageThemeSave = useBlockThemeStore((s) => s.setPageThemeSave);

  useEffect(() => {
    setThemes(listThemes());
  }, []);

  if (themes.length === 0) return null;

  function handleSelect(id: string) {
    const save = themes.find((t) => t.id === id);
    if (save) setPageThemeSave(save);
  }

  return (
    <Select onValueChange={handleSelect}>
      <SelectTrigger className="h-9 w-auto gap-1.5 text-sm">
        <HugeiconsIcon icon={PaletteIcon} className="size-3.5" />
        <SelectValue placeholder="Apply theme" />
      </SelectTrigger>
      <SelectContent>
        {themes.map((theme) => (
          <SelectItem key={theme.id} value={theme.id}>
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
