import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  openGraph: {
    images: [`/seo.jpg`]
  }
};

export default function Home() {
  return (
    <section className="px-4 py-16 lg:py-24">
      <div className="mx-auto max-w-(--breakpoint-md) mb-8 lg:mb-12">
        <header className="mb-10">
          <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
            Legal
          </p>
          <h1 className="font-heading text-4xl md:text-5xl">Privacy Policy</h1>
        </header>
        <article>
          <p>
            Your privacy is important to us and protecting your personal data is one of our highest
            priorities. We use the information we collect about you to review all the transactions
            you make using our website and to provide a more personalized shopping experience.Your
            privacy is important to us and protecting your personal data is one of our highest
            priorities. We use the information we collect about you to review all transactions you
            make using our website and to provide a more personalized user experience.
          </p>
          <h2>What information do we collect?</h2>
          <p>
            Data collected through cookies such as device information used, tracking history,
            products and services used, frequency of interaction, category preferences, frequency of
            use of services, browser information and session information are automatically recorded.
          </p>
          <h2>What do we use the information we collect?</h2>
          <p>We use the personal data we collect for the following purposes;</p>
          <ul className="list-disc">
            <li>Offering, personalizing and improving products and services</li>
            <li>Informing the user about the campaigns</li>
            <li>Monitoring user actions</li>
            <li>Measuring and analyzing</li>
            <li>Developing customer relations by communicating with the user</li>
            <li>Developing products and services by analyzing user experiences</li>
            <li>Detection of transactions contrary to the user agreement and/or privacy policy</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
