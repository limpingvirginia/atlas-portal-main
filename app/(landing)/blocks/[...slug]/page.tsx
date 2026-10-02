import { HugeiconsIcon } from "@hugeicons/react";
import {
  FullscreenIcon,
  HomeIcon
} from "@hugeicons/core-free-icons";
import { Metadata } from "next";
import { generateMeta } from "@/lib/metadata";
import { categories } from "../categories";
import ComponentIframe from "./components/component-iframe";
import CodeDialog from "./components/code-dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ViewportToolbar from "@/components/viewport-toolbar";
import ArticleSection from "./components/article-section";
import PaginationButtons from "./components/pagination-buttons";
import { Category } from "../categories";
import { blocksCount } from "@/lib/content-count";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import ProSection from "./components/pro-section";
import IframeDarkToggle from "./components/iframe-dark-toggle";
import ComponentScrollNav from "./components/component-scroll-nav";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const defaultDescription = `Browse ${blocksCount.rounded}+ blocks & sections for Shadcn UI. Copy and paste instantly or install via the shadcn CLI.`;
  const { slug } = await params;
  const url = `/blocks/${slug.join("/")}`;
  const category = categories.find((c) => c.href === url);

  if (!category) {
    return generateMeta({
      title: "Shadcn Blocks",
      description: defaultDescription,
      canonical: url.replace(/^\//, "")
    });
  }

  const count = category.components?.length || 0;
  const description = `Explore ${count}+ ready-to-use ${category.sidebarTitle ?? category.title} blocks built with shadcn/ui, Tailwind CSS, and React. Copy and paste directly into your project or install instantly via the shadcn CLI.`;

  return generateMeta({
    title: category.title,
    description,
    canonical: category.href
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;

  const url = `/blocks/${slug.join("/")}`;
  // urlExploded = ["blocks", "charts"]
  const urlExploded = url.split("/").filter(Boolean);

  const category = categories.find((c) => c.href === url);
  const components = category?.components;

  const currentIndex = categories.findIndex((item) => item.href === url);
  const previousItem = currentIndex > 0 ? categories[currentIndex - 1] : null;
  const nextItem = currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null;

  return (
    <>
      <header className="flex max-w-5xl flex-col justify-between space-y-3 lg:pt-6">
        <Breadcrumb className="lg:mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <HugeiconsIcon icon={HomeIcon} className="size-3.5" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blocks">Blocks</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{category?.sidebarTitle ?? category?.title}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-heading text-3xl lg:text-4xl">{category?.title}</h1>
        <p className="text-muted-foreground leading-relaxed text-balance">
          {category?.description}
        </p>
      </header>

      <div className="space-y-4 py-8 lg:space-y-6">
        {components?.map((component, index) => {
          const urlParams = new URLSearchParams();
          const compKey = component.href.split("/").pop() || "";
          const viewportKey = `${slug.join("-")}-${compKey}`;
          urlParams.set("path", component.href);

          if ("height" in component && component.height) {
            urlParams.set("height", String(component.height));
          }
          if ("responsive" in component && (component as any).responsive) {
            urlParams.set("responsive", String((component as any).responsive));
          }
          if ("customStyle" in component && (component as any).customStyle) {
            urlParams.set("customStyle", "true");
          }

          const iframeUrl = `/demo?${urlParams.toString()}`;
          // filePath = "blocks/charts/1"
          const filePath = `${urlExploded[0]}/${urlExploded[1]}/${compKey}`;

          return (
            <div
              key={compKey}
              id={compKey}
              className={cn("scroll-mt-20 space-y-4 lg:space-y-6", {
                "mb-10 lg:mb-16": components.length !== index + 1
              })}>
              <h2 className="font-heading flex items-center gap-3 text-xl">
                {component.title}{" "}
                {component.isPro ? (
                  <Badge
                    variant="outline"
                    className="border-amber-300 bg-amber-50 text-[10px] tracking-widest text-amber-600 uppercase dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
                    Pro
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-green-300 bg-green-50 text-[10px] tracking-widest text-green-600 uppercase dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                    Free
                  </Badge>
                )}
              </h2>
              <div className="rounded-lg border">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <CodeDialog filePath={filePath} comp={component} />
                  </div>
                  <div className="flex items-center gap-2">
                    <IframeDarkToggle viewportKey={viewportKey} />
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="outline" asChild>
                          <Link href={iframeUrl} target="_blank">
                            <HugeiconsIcon icon={FullscreenIcon} />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Full Screen</p>
                      </TooltipContent>
                    </Tooltip>
                    <ViewportToolbar componentId={viewportKey} />
                  </div>
                </div>
                <ComponentIframe
                  id={index + 1}
                  url={iframeUrl}
                  viewportKey={viewportKey}
                  contentPadding={(component as any)?.contentPadding ?? false}
                />
              </div>
            </div>
          );
        })}

        <ComponentScrollNav ids={components?.map((c) => c.href.split("/").pop() ?? "") ?? []} />

        <PaginationButtons previousItem={previousItem} nextItem={nextItem} />

        <ArticleSection slug={slug} category={category as Category} />

        <ProSection />
      </div>
    </>
  );
}
