import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import { LicenseEmail } from "@/components/emails/license-email";
import { NewSaleEmail } from "@/components/emails/new-sale-email";
import { MagicLinkEmail } from "@/components/emails/magic-link-email";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

type MailInput =
  | {
      template: "license";
      to: string;
      from: string;
      subject: string;
      data: { licenseKey?: string; productName?: string };
    }
  | {
      template: "new-sale";
      to: string;
      from: string;
      subject: string;
      data: { customerEmail?: string; productName?: string; price?: string };
    }
  | {
      template: "magic-link";
      to: string;
      from: string;
      subject: string;
      data: { url?: string };
    };

export async function sendMail(input: MailInput) {
  try {
    const html = await render(
      input.template === "license" ? (
        <LicenseEmail {...input.data} />
      ) : input.template === "new-sale" ? (
        <NewSaleEmail {...input.data} />
      ) : (
        <MagicLinkEmail {...input.data} />
      )
    );

    await transporter.sendMail({
      from: `${input.from} <${process.env.GMAIL_USER}>`,
      to: input.to,
      subject: input.subject,
      html
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send mail:", error);
    return { success: false };
  }
}
