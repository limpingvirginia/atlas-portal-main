import type { ComponentType } from "react";
import {
  HeroSections,
  CtaSections,
  PricingTables,
  FeatureSections,
  Testimonials,
  TeamSections,
  Integrations,
  NewsletterSections,
  Footers,
  Navbars,
  ProductList,
  ProductCategory,
  ProductDetails,
  ProductFeatures,
  PromoSections,
  StoreNavigation,
  ProductQuickviews,
  FormLayouts,
  Charts,
  SignInForms,
  StatCards,
  ModalDialogs,
  PageLayouts,
  SidebarLayouts,
  Tables,
  ChangelogPage,
} from "../../articles";
import { Category } from "../../categories";

const articleBySlug: Record<string, ComponentType> = {
  "hero-sections": HeroSections,
  "cta-sections": CtaSections,
  "pricing-tables": PricingTables,
  "feature-sections": FeatureSections,
  testimonials: Testimonials,
  "team-sections": TeamSections,
  integrations: Integrations,
  "newsletter-sections": NewsletterSections,
  footers: Footers,
  navbars: Navbars,
  "product-list": ProductList,
  "product-category": ProductCategory,
  "product-details": ProductDetails,
  "product-features": ProductFeatures,
  "promo-sections": PromoSections,
  "store-navigation": StoreNavigation,
  "product-quickviews": ProductQuickviews,
  "form-layouts": FormLayouts,
  charts: Charts,
  "sign-in-forms": SignInForms,
  "stat-cards": StatCards,
  "modal-dialogs": ModalDialogs,
  "page-layouts": PageLayouts,
  "sidebar-layouts": SidebarLayouts,
  tables: Tables,
  "changelog-page": ChangelogPage,
};

export default function ArticleSection({
  slug,
  category,
}: {
  slug: string[];
  category: Category;
}) {
  const sectionSlug = slug[slug.length - 1];
  const ArticleContent = sectionSlug ? articleBySlug[sectionSlug] : undefined;

  if (!ArticleContent) return null;

  return (
    <div className="flex flex-col items-end gap-10 pt-4 md:flex-row lg:pt-10">
      <article className="prose prose-neutral dark:prose-invert prose-h2:font-semibold prose-h2:mb-4 max-md:prose-p:text-sm max-w-full md:max-w-2xl">
        <h2 className="text-2xl lg:text-3xl">
          About {(category as any).sidebarTitle ?? category?.title} Blocks
        </h2>
        <ArticleContent />
      </article>
      <figure className="block aspect-video max-w-full overflow-hidden rounded-lg border md:max-w-md dark:hidden">
        <img
          src={`/images${category.href}.png`}
          alt={`${category.title.toLowerCase()}`}
          className="w-full object-contain"
        />
      </figure>
      <figure className="hidden aspect-video max-w-full overflow-hidden rounded-lg border md:max-w-md dark:block">
        <img
          src={`/images${category.href}-dark.png`}
          alt={`${category.title.toLowerCase()} dark`}
          className="w-full object-contain"
        />
      </figure>
    </div>
  );
}
