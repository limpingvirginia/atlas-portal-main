import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconLayoutKanban,
  IconShoppingBag,
  IconTruck,
  IconUsers,
  IconUserSquareRounded,
  TablerIcon
} from "@tabler/icons-react";
import componentsNav from "./components-nav.json";

export type SidebarGroup = {
  title: string;
  items: SidebarGroupItem[];
};

export type SidebarGroupItem = {
  title: string;
  url?: string;
  icon?: TablerIcon;
  items?: SidebarGroupItem[];
};

export const sidebarData: SidebarGroup[] = [
  {
    title: "Main",
    items: [
      {
        title: "Ecommerce",
        url: "/ecommerce",
        icon: IconDashboard,
        items: [
          {
            title: "Dashboard",
            url: "/ecommerce"
          },
          {
            title: "Product Filter",
            url: "/ecommerce/product-filter"
          },
          {
            title: "Product Detail",
            url: "/ecommerce/product-detail"
          },
          {
            title: "Seller Profile",
            url: "/ecommerce/seller-profile"
          },
          {
            title: "Category Page",
            url: "/ecommerce/category-page"
          }
        ]
      },
      {
        title: "CRM",
        url: "/crm",
        icon: IconDashboard,
        items: [
          {
            title: "Dashboard",
            url: "/crm"
          },
          {
            title: "Customers",
            url: "/crm/customers"
          },
          {
            title: "Leads",
            url: "/crm/leads"
          }
        ]
      },
      {
        title: "Banking",
        url: "/banking",
        icon: IconDashboard
      },
      {
        title: "Real Estate",
        url: "/real-estate",
        icon: IconFolder,
        items: [
          {
            title: "Dashboard",
            url: "/real-estate"
          },
          {
            title: "Property Details",
            url: "/real-estate/property-details"
          },
          {
            title: "Search Results",
            url: "/real-estate/search"
          },
          {
            title: "Map View",
            url: "/real-estate/map-view"
          }
        ]
      },
      {
        title: "Logistics",
        url: "/logistics",
        icon: IconTruck,
        items: [
          {
            title: "Dashboard",
            url: "/logistics"
          },
          {
            title: "Shipments",
            url: "/logistics/shipments"
          }
        ]
      }
    ]
  },
  {
    title: "Web Apps",
    items: [
      {
        title: "AI Chatbot",
        url: "/ai-chatbot",
        icon: IconUsers
      },
      {
        title: "Chats",
        url: "/chats",
        icon: IconUsers
      },
      {
        title: "Kanban Board",
        url: "/kanban-board",
        icon: IconLayoutKanban
      },
      {
        title: "Social Network",
        url: "/social-network",
        icon: IconFolder,
        items: [
          {
            title: "Timeline",
            url: "/social-network"
          },
          {
            title: "Profile",
            url: "/social-network/profile"
          }
        ]
      },
      {
        title: "POS App",
        url: "/pos-app",
        icon: IconFolder
      },
      {
        title: "Education",
        url: "/education",
        icon: IconFolder,
        items: [
          {
            title: "Education Detail",
            url: "/education/detail"
          },
          {
            title: "Course Detail",
            url: "/education/course-detail"
          }
        ]
      },
      {
        title: "Job Postings",
        url: "/job-postings",
        icon: IconFolder
      },
      {
        title: "User",
        url: "/user",
        icon: IconChartBar,
        items: [
          {
            title: "Profile",
            url: "/user/profile"
          },
          {
            title: "Settings",
            url: "/user/settings"
          }
        ]
      }
    ]
  },
  {
    title: "Components",
    items: [
      {
        title: "Base",
        icon: IconShoppingBag,
        items: componentsNav
          .filter((z) => z.category === "base")
          .map((a) => ({
            title: a.title,
            url: `/components/${a.name}`
          }))
      },
      {
        title: "Feedback",
        icon: IconShoppingBag,
        items: componentsNav
          .filter((z) => z.category === "feedback")
          .map((a) => ({
            title: a.title,
            url: `/components/${a.name}`
          }))
      },
      {
        title: "Forms",
        icon: IconUserSquareRounded,
        items: componentsNav
          .filter((z) => z.category === "forms")
          .map((a) => ({
            title: a.title,
            url: `/components/${a.name}`
          }))
      },
      {
        title: "Data Display",
        icon: IconUserSquareRounded,
        items: componentsNav
          .filter((z) => z.category === "data-display")
          .map((a) => ({
            title: a.title,
            url: `/components/${a.name}`
          }))
      },
      {
        title: "Navigation",
        icon: IconUserSquareRounded,
        items: componentsNav
          .filter((z) => z.category === "navigation")
          .map((a) => ({
            title: a.title,
            url: `/components/${a.name}`
          }))
      },
      {
        title: "Graph",
        icon: IconUserSquareRounded,
        items: componentsNav
          .filter((z) => z.category === "graph")
          .map((a) => ({
            title: a.title,
            url: `/components/${a.name}`
          }))
      }
    ]
  }
];
