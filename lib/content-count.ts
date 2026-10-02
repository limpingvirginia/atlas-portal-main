import { categories } from "@/app/(landing)/blocks/categories";

const total = categories.reduce((acc, c) => acc + c.components.length, 0);
const rounded = Math.floor(total / 10) * 10;

export const blocksCount = {
  total,
  rounded,
};
