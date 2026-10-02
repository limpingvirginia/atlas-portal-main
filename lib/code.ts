import fs from "fs";
import path from "path";

// filePath like "blocks/charts/1" → app/(landing)/blocks/contents/blocks/charts/1/index.tsx
function resolveBlockFilePath(filePath: string): string {
  return path.join(process.cwd(), "app/(landing)/blocks/contents", filePath);
}

export function extractCodeFromFilePath(filePath: string): string {
  try {
    return fs.readFileSync(resolveBlockFilePath(filePath), "utf-8");
  } catch {
    return `// File not found: ${filePath}`;
  }
}

export type FileEntry = {
  name: string;
  path: string;
};

export function getFilesInDirectory(filePath: string): FileEntry[] {
  try {
    const fullDir = resolveBlockFilePath(filePath);
    return fs
      .readdirSync(fullDir)
      .filter((e) => e.endsWith(".tsx") || e.endsWith(".ts"))
      .map((e) => ({ name: e, path: filePath + "/" + e }));
  } catch {
    return [];
  }
}
