import { create } from "zustand";

export interface Technology {
  id: string;
  name: string;
  isBundle: boolean;
  isComing: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  description: string;
  isPopular: boolean;
}

export interface PlanFeature {
  id: string;
  featureName: string;
  featureDesc?: string;
  featureValue: string | null;
  isAvailable: boolean;
}

export interface TechnologyData {
  plans: PricingPlan[];
  features: Record<string, PlanFeature[]>;
}

interface PricingStore {
  technologies: Technology[];
  allData: Record<string, TechnologyData>;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const FEATURE_DESCS = {
  seats: "How many developers can use the template under this license.",
  projects: "The number of end products you can build and ship with one license.",
  support: "How long you can reach us directly by email for help and questions.",
  components: "Full access to every premium component, page template and block.",
  figma: "The complete Figma design file that matches the coded template.",
  updates: "Every future release is included, with no renewals or extra payments."
};

/** Pro and Premium share the same feature rows; only the values differ. */
function buildFeatures(prefix: string, tier: "pro" | "premium"): PlanFeature[] {
  const isPremium = tier === "premium";
  return [
    {
      id: `${prefix}-1`,
      featureName: "Seats",
      featureDesc: FEATURE_DESCS.seats,
      featureValue: isPremium ? "20" : "1",
      isAvailable: true
    },
    {
      id: `${prefix}-2`,
      featureName: "Projects",
      featureDesc: FEATURE_DESCS.projects,
      featureValue: isPremium ? "Unlimited" : "3 Projects",
      isAvailable: true
    },
    {
      id: `${prefix}-3`,
      featureName: "Email Support",
      featureDesc: FEATURE_DESCS.support,
      featureValue: isPremium ? "12 Months" : "6 Months",
      isAvailable: true
    },
    {
      id: `${prefix}-4`,
      featureName: "All Pro Components",
      featureDesc: FEATURE_DESCS.components,
      featureValue: "true",
      isAvailable: true
    },
    {
      id: `${prefix}-5`,
      featureName: "Figma Design Source",
      featureDesc: FEATURE_DESCS.figma,
      featureValue: isPremium ? "true" : "false",
      isAvailable: isPremium
    },
    {
      id: `${prefix}-6`,
      featureName: "Lifetime Free Updates",
      featureDesc: FEATURE_DESCS.updates,
      featureValue: "true",
      isAvailable: true
    }
  ];
}

function buildPlans(techPrefix: string): PricingPlan[] {
  return [
    {
      id: `${techPrefix}-starter`,
      name: "Pro",
      originalPrice: 129,
      discountedPrice: 79,
      description: "For one developer shipping one product at a time.",
      isPopular: true
    },
    {
      id: `${techPrefix}-extended`,
      name: "Premium",
      originalPrice: 299,
      discountedPrice: 199,
      description: "For teams building together, up to 20 members.",
      isPopular: false
    }
  ];
}

export const usePricingStore = create<PricingStore>((set) => ({
  technologies: [
    { id: "nextjs", name: "Next.js", isBundle: false, isComing: false },
    { id: "vite", name: "Vite", isBundle: false, isComing: true },
    { id: "vuejs", name: "Vue.js", isBundle: false, isComing: true },
    { id: "svelte", name: "Svelte", isBundle: false, isComing: true },
    { id: "angular", name: "Angular", isBundle: false, isComing: true },
    { id: "figma", name: "Figma", isBundle: false, isComing: true }
  ],
  allData: {
    vitejs: {
      plans: buildPlans("react"),
      features: {
        "react-starter": buildFeatures("rs", "pro"),
        "react-extended": buildFeatures("re", "premium")
      }
    },
    nextjs: {
      plans: buildPlans("nextjs"),
      features: {
        "nextjs-starter": buildFeatures("ns", "pro"),
        "nextjs-extended": buildFeatures("ne", "premium")
      }
    },
    vue: {
      plans: buildPlans("vue"),
      features: {
        "vue-starter": buildFeatures("vs", "pro"),
        "vue-extended": buildFeatures("ve", "premium")
      }
    }
  },
  selectedTab: "nextjs",
  setSelectedTab: (tab) => set({ selectedTab: tab })
}));
