import React from "react";
import Content from "@/app/(landing)/content";
import { categories } from "../categories";
import { notFound } from "next/navigation";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const category = categories.find((c) => c.href === `/blocks/${slug.join("/")}`);

  if (!category) {
    return notFound();
  }

  return (
    <Content>
      <div className="w-full min-w-0">{children}</div>
    </Content>
  );
}
