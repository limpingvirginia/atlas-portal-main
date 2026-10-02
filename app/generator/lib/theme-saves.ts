export type ThemeSave = {
  id: string;
  name: string;
  state: {
    colors?: Record<string, string>;
    typography?: Record<string, string>;
    spacing?: Record<string, string>;
    others?: Record<string, string>;
  };
};

export function listThemes(): ThemeSave[] {
  try {
    if (typeof localStorage === "undefined") return [];
    const saved = localStorage.getItem("block-theme-saves");
    return saved ? (JSON.parse(saved) as ThemeSave[]) : [];
  } catch {
    return [];
  }
}
