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
  Section,
  Tailwind,
  Text
} from "@react-email/components";

interface NewSaleEmailProps {
  customerEmail?: string;
  productName?: string;
  price?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const NewSaleEmail = ({ customerEmail, productName, price }: NewSaleEmailProps) => (
  <Html>
    <Head />
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
            New Sale 🎉
          </Heading>
          <Text className="mx-0 mt-0 mb-[15px] text-[15px] leading-[1.4] text-[#3c4149]">
            Product: {productName}
          </Text>
          <Text className="mx-0 mt-0 mb-[15px] text-[15px] leading-[1.4] text-[#3c4149]">
            Customer email: {customerEmail}
          </Text>
          <Text className="mx-0 mt-0 mb-[15px] text-[15px] leading-[1.4] text-[#3c4149]">
            Price: {price}
          </Text>
          <Section className="px-0 py-[27px]">
            <Button
              className="block rounded bg-[#000000] px-[23px] py-[11px] text-center text-[15px] font-semibold text-white no-underline"
              href={baseUrl}>
              Visit Shadcn UI Dashboard
            </Button>
          </Section>
          <Hr className="mt-[42px] mb-[26px] border-[#dfe1e4]" />
          <Link href={baseUrl} className="text-[14px] text-[#b4becc]">
            Shadcn UI Dashboard
          </Link>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
