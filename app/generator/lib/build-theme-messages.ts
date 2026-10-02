import type { ThemeSave } from "./theme-saves";

type ThemeMessage =
  | { type: "theme"; value: "dark" | "light" }
  | { type: "theme-colors"; colors: Record<string, string> }
  | { type: "theme-typography"; typography: Record<string, string> }
  | { type: "theme-spacing"; spacing: Record<string, string> }
  | { type: "theme-others"; others: Record<string, string> };

export function buildThemeMessagesFromState(
  state: ThemeSave["state"],
  isDark: boolean
): ThemeMessage[] {
  const messages: ThemeMessage[] = [
    { type: "theme", value: isDark ? "dark" : "light" },
  ];

  if (state?.colors) {
    messages.push({ type: "theme-colors", colors: state.colors });
  }
  if (state?.typography) {
    messages.push({ type: "theme-typography", typography: state.typography });
  }
  if (state?.spacing) {
    messages.push({ type: "theme-spacing", spacing: state.spacing });
  }
  if (state?.others) {
    messages.push({ type: "theme-others", others: state.others });
  }

  return messages;
}
