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

interface MagicLinkEmailProps {
  url?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const MagicLinkEmail = ({ url }: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>Your sign-in link for Shadcn UI Dashboard</Preview>
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
            Sign in to Shadcn UI Dashboard
          </Heading>
          <Text className="mx-0 mt-0 mb-[15px] text-[15px] leading-[1.4] text-[#3c4149]">
            Click the button below to sign in to your account instantly. No password needed.
          </Text>
          <Section className="px-0 py-[27px]">
            <Button
              className="block rounded bg-[#000000] px-[23px] py-[11px] text-center text-[15px] font-semibold text-white no-underline"
              href={url}>
              Sign in to your account
            </Button>
          </Section>
          <Text className="mx-0 mt-0 mb-[15px] text-[15px] leading-[1.4] text-[#3c4149]">
            This link expires shortly and can only be used once. If you didn&apos;t request it, you
            can safely ignore this email.
          </Text>
          <Hr className="mt-[42px] mb-[26px] border-[#dfe1e4]" />
          <Link href={baseUrl} className="text-[14px] text-[#b4becc]">
            Shadcn UI Dashboard
          </Link>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
