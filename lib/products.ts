import { ProductTypeEnum } from "@/enums/product-type-enum";

export interface Product {
  id: string;
  paddle_product_id: {
    production: string;
    sandbox: string;
  };
  name?: string;
  full_name?: string;
  slug?: string;
  short_description?: string;
  long_description?: string;
  key: string;
  title?: string;
  images?: ProductImage[];
  /** Display price shown in the UI */
  price: string;
  /** Charged amount in the currency's lowest unit (cents), as required by the Paddle API */
  unit_amount: string;
  currency_code: string;
  /** Private GitHub repo ("owner/name") the buyer gets collaborator access to. Per-tech repos (vite, vuejs…) become separate products. */
  github_repo?: string;
  preview_url?: string;
  type: string;
  activation_limit?: number;
}

interface ProductImage {
  url: string;
  title: string;
}

export const products: Product[] = [
  {
    id: "nextjs-starter",
    paddle_product_id: {
      production: "pro_01je1jtwhxqbcanghbgb0fa4xj",
      sandbox: "pro_01kzmfq2ra6ma0qy6hsgfck9yg"
    },
    key: ProductTypeEnum.Figma,
    price: "$79",
    unit_amount: "7900",
    currency_code: "USD",
    github_repo: "bundui/shadcn-ui-dashboard-nextjs",
    name: "Shadcn UI Dashboard (Pro)",
    full_name: "Shadcn UI Dashboard (Pro license)",
    title: "Shadcn UI Dashboard (Pro license)",
    type: ProductTypeEnum.Figma,
    activation_limit: 1
  },
  {
    id: "nextjs-extended",
    paddle_product_id: {
      production: "pro_01je1jtwhxqbcanghbgb0fa4xj",
      sandbox: "pro_01kzmfq2ra6ma0qy6hsgfck9yg"
    },
    key: ProductTypeEnum.Nextjs,
    price: "$199",
    unit_amount: "19900",
    currency_code: "USD",
    github_repo: "bundui/shadcn-ui-dashboard-nextjs",
    name: "Shadcn UI Dashboard (Premium)",
    full_name: "Shadcn UI Dashboard (Premium license)",
    title: "Shadcn UI Dashboard (Premium license)",
    type: ProductTypeEnum.Nextjs,
    activation_limit: 1
  },
  {
    // Paid difference between the Pro and Premium licenses — only purchasable
    // by signed-in customers who already own the starter (enforced server-side)
    id: "nextjs-upgrade",
    paddle_product_id: {
      production: "pro_01je1jtwhxqbcanghbgb0fa4xj",
      sandbox: "pro_01kzmfq2ra6ma0qy6hsgfck9yg"
    },
    key: ProductTypeEnum.Nextjs,
    price: "$120",
    unit_amount: "12000",
    currency_code: "USD",
    github_repo: "bundui/shadcn-ui-dashboard-nextjs",
    name: "Shadcn UI Dashboard (Upgrade to Premium)",
    full_name: "Shadcn UI Dashboard (Upgrade to Premium license)",
    title: "Shadcn UI Dashboard (Upgrade to Premium license)",
    type: ProductTypeEnum.Nextjs,
    activation_limit: 1
  }
];

/** Product ids that grant a team when purchased. */
export const TEAM_PRODUCT_IDS = ["nextjs-extended", "nextjs-upgrade"];
