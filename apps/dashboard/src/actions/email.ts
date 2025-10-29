"use server";

import { resend } from "data-access/mail";

export const sendEmail = async ({
  to,
  subject,
  meta,
}: {
  to: string;
  subject: string;
  meta: { description: string; link: string };
}) => {
  if (!process.env.MAIL_FROM) {
    throw new Error("MAIL_FROM is not set");
  }

  await resend.emails.send({
    from: process.env.MAIL_FROM,
    to: [to],
    subject,
    html: `
    <p>${meta.description}</p>
    <a href="${meta.link}">${meta.link}</a>
  `,
  });
};
