interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

export const FAQList: FAQProps[] = [
  {
    question: "What exactly do I get after purchase?",
    answer:
      "Instant access to your account dashboard, where you can request access to the private GitHub repository or download the full source code as a zip. Your purchase is linked to your email automatically.",
    value: "item-1"
  },
  {
    question: "What's the difference between the Pro and Premium licenses?",
    answer:
      "The Pro license covers one developer. The Premium license covers up to 20 members. Each member gets their own sign-in, their own GitHub repository access and their own license keys, managed from your Teams page.",
    value: "item-2"
  },
  {
    question: "Can I upgrade from Pro to Premium later?",
    answer:
      "Yes. If you own a Pro license, you can upgrade to a Premium license from your account dashboard by paying only the difference, and your existing access carries over.",
    value: "item-3"
  },
  {
    question: "Do I get updates after buying?",
    answer:
      "Yes. You keep access to the private repository, so you can pull new pages, blocks and fixes as they ship. Every release is documented on the Updates page.",
    value: "item-4"
  },
  {
    question: "Which frameworks are supported?",
    answer:
      "The template is built with Next.js 15, React 19, Tailwind CSS 4 and TypeScript. Additional stacks are planned, so check the Roadmap page for what's coming next.",
    value: "item-5"
  },
  {
    question: "How does payment work?",
    answer:
      "Checkout is a one-time payment handled securely by Paddle. Major credit cards are supported and Paddle issues the invoice. No subscription, no recurring fees.",
    value: "item-6"
  }
];
