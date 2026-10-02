import { create } from "zustand";
import type { ThemeSave } from "@/app/generator/lib/theme-saves";

type State = {
  pageThemeSave: ThemeSave | null;
  setPageThemeSave: (save: ThemeSave) => void;
  darkModeByKey: Record<string, boolean>;
  setDarkMode: (key: string, value: boolean) => void;
};

export const useBlockThemeStore = create<State>((set) => ({
  pageThemeSave: null,
  setPageThemeSave: (save) => set({ pageThemeSave: save }),
  darkModeByKey: {},
  setDarkMode: (key, value) =>
    set((s) => ({ darkModeByKey: { ...s.darkModeByKey, [key]: value } })),
}));
