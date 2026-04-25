"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ClaimGuard <claims@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error ${res.status}: ${body}`);
  }
}

export const sendApprovalEmail = action({
  args: {
    to: v.string(),
    claimRef: v.string(),
    payoutLow: v.optional(v.number()),
    payoutHigh: v.optional(v.number()),
  },
  handler: async (_ctx, { to, claimRef, payoutLow, payoutHigh }) => {
    const payoutLine =
      payoutLow != null && payoutHigh != null
        ? `<p>Your approved payout is <strong>€${payoutLow.toLocaleString("de-DE")} – €${payoutHigh.toLocaleString("de-DE")}</strong>. You will receive a bank transfer within 3–5 business days.</p>`
        : `<p>Our team will confirm the exact payout amount shortly.</p>`;

    await sendEmail({
      to,
      subject: `Claim ${claimRef} Approved`,
      html: `
        <p>Dear customer,</p>
        <p>We're pleased to inform you that your insurance claim <strong>${claimRef}</strong> has been <strong style="color:#16a34a">approved</strong>.</p>
        ${payoutLine}
        <p>If you have any questions, reply to this email.</p>
        <p>Best regards,<br/>ClaimGuard Team</p>
      `,
    });
  },
});

export const sendRejectionEmail = action({
  args: {
    to: v.string(),
    claimRef: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (_ctx, { to, claimRef, reason }) => {
    const reasonLine = reason
      ? `<p>Reason: ${reason}</p>`
      : `<p>Unfortunately, your claim does not meet the coverage criteria outlined in your policy.</p>`;

    await sendEmail({
      to,
      subject: `Claim ${claimRef} — Decision`,
      html: `
        <p>Dear customer,</p>
        <p>After reviewing your insurance claim <strong>${claimRef}</strong>, we regret to inform you that it has been <strong style="color:#dc2626">rejected</strong>.</p>
        ${reasonLine}
        <p>You may appeal this decision within 30 days by replying to this email.</p>
        <p>Best regards,<br/>ClaimGuard Team</p>
      `,
    });
  },
});
