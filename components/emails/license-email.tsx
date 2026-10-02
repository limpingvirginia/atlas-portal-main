import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from "@react-email/components";

interface LicenseEmailProps {
  licenseKey?: string;
  productName?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const LicenseEmail = ({ licenseKey, productName }: LicenseEmailProps) => (
  <Html>
    <Head />
    <Preview>Thank you for your purchase. Your license key is inside</Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto my-0 max-w-[560px] px-0 pt-5 pb-12">
          <Img
            src={`${baseUrl}/logo.png`}
            width="42"
            height="42"
            alt="Shadcn UI Dashboard"
            className="h-[42px] w-[42px] rounded-3xl"
          />
          <Heading className="px-0 pt-[17px] pb-0 text-[24px] leading-[1.3] font-normal tracking-[-0.5px] text-[#484848]">
            Thank you for your payment ❤️ Your license key for {productName ?? "Shadcn UI Dashboard"}
          </Heading>
          <Text className="mx-0 mt-0 mb-[15px] text-[15px] leading-[1.4] text-[#3c4149]">
            Sign in with Google using this email address to access your products, licenses and
            invoices anytime.
          </Text>
          <Section className="px-0 py-[27px]">
            <Button
              className="block rounded bg-[#000000] px-[23px] py-[11px] text-center text-[15px] font-semibold text-white no-underline"
              href={`${baseUrl}/dashboard`}>
              Go to your dashboard
            </Button>
          </Section>
          {licenseKey ? (
            <>
              <Text className="mx-0 mt-0 mb-[15px] text-[15px] leading-[1.4] text-[#3c4149]">
                The license key below has been specifically defined for you. You can use it for a
                lifetime:
              </Text>
              <code className="rounded bg-[#dfe1e4] px-1 py-px font-mono text-[21px] font-bold tracking-[-0.3px] text-[#3c4149]">
                {licenseKey}
              </code>
            </>
          ) : (
            <Text className="mx-0 mt-0 mb-[15px] text-[15px] leading-[1.4] text-[#3c4149]">
              Once signed in, you can create license keys anytime from the Licenses section of your
              dashboard to download premium components with the shadcn CLI.
            </Text>
          )}
          <Hr className="mt-[42px] mb-[26px] border-[#dfe1e4]" />
          <Link href={baseUrl} className="text-[14px] text-[#b4becc]">
            Shadcn UI Dashboard
          </Link>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
