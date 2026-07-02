import { Resend } from "resend";
import { eq } from "drizzle-orm";
import { requireDb, emailLogs } from "@/lib/firstdomain/db";
import type { EmailTemplate } from "@/lib/firstdomain/types";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL =
  process.env.FIRSTDOMAIN_FROM_EMAIL || "First Domain <onboarding@resend.dev>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  template: EmailTemplate;
  applicationId?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  template,
  applicationId,
}: SendEmailOptions): Promise<boolean> {
  const db = requireDb();

  const existing = applicationId
    ? await db
        .select()
        .from(emailLogs)
        .where(eq(emailLogs.applicationId, applicationId))
        .then((logs) => logs.find((l) => l.template === template))
    : null;

  if (existing && existing.status === "sent") {
    return true;
  }

  if (!resend) {
    console.log(`[Email] ${template} to ${to}: ${subject}`);
    await db.insert(emailLogs).values({
      applicationId,
      template,
      recipient: to,
      status: "skipped",
      errorMessage: "RESEND_API_KEY not configured",
    });
    return false;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    await db.insert(emailLogs).values({
      applicationId,
      template,
      recipient: to,
      status: "sent",
    });
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await db.insert(emailLogs).values({
      applicationId,
      template,
      recipient: to,
      status: "failed",
      errorMessage: message,
    });
    return false;
  }
}

export function emailWrapper(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 24px;">
          <strong style="font-size: 18px; color: #0f172a;">First Domain</strong>
        </div>
        ${content}
        <p style="margin-top: 32px; font-size: 12px; color: #94a3b8;">
          First Domain — Founder Discovery Platform
        </p>
      </body>
    </html>
  `;
}

export async function sendApplicationReceivedEmail(
  to: string,
  name: string,
  projectName: string,
  applicationId: string
) {
  return sendEmail({
    to,
    subject: "Application received — First Domain",
    template: "application-received",
    applicationId,
    html: emailWrapper(`
      <h2 style="color: #0f172a;">Thanks for applying, ${name}!</h2>
      <p>We've received your application for <strong>${projectName}</strong>.</p>
      <p>Our team will review all applications during the review period. You'll receive an email when your application status changes.</p>
      <p>In the meantime, you can check domain availability or explore previous winners on our site.</p>
    `),
  });
}

export async function sendUnderReviewEmail(
  to: string,
  name: string,
  projectName: string,
  applicationId: string
) {
  return sendEmail({
    to,
    subject: "Your application is under review — First Domain",
    template: "application-under-review",
    applicationId,
    html: emailWrapper(`
      <h2 style="color: #0f172a;">Hi ${name},</h2>
      <p>Your application for <strong>${projectName}</strong> is now under review.</p>
      <p>We're evaluating applications based on product readiness, impact, vision, execution, and launch readiness.</p>
    `),
  });
}

export async function sendWinnerSelectedEmail(
  to: string,
  name: string,
  projectName: string,
  domain: string,
  applicationId: string
) {
  return sendEmail({
    to,
    subject: "Congratulations — You're this month's First Domain winner!",
    template: "winner-selected",
    applicationId,
    html: emailWrapper(`
      <h2 style="color: #0f172a;">Congratulations, ${name}! 🎉</h2>
      <p>You've been selected as this month's First Domain winner for <strong>${projectName}</strong>.</p>
      <p>Your domain <strong>${domain}</strong> will be registered shortly. We'll send you a confirmation once it's ready.</p>
      <p>Get ready to launch!</p>
    `),
  });
}

export async function sendDomainRegisteredEmail(
  to: string,
  name: string,
  domain: string,
  applicationId: string
) {
  return sendEmail({
    to,
    subject: `Your domain ${domain} is registered!`,
    template: "domain-registered",
    applicationId,
    html: emailWrapper(`
      <h2 style="color: #0f172a;">Your domain is ready, ${name}!</h2>
      <p><strong>${domain}</strong> has been successfully registered.</p>
      <p>You can now configure DNS and launch your product. We're excited to see what you build!</p>
    `),
  });
}

export async function sendLaunchReminderEmail(
  to: string,
  name: string,
  projectName: string,
  launchDate: string,
  applicationId: string
) {
  return sendEmail({
    to,
    subject: "Launch reminder — 30 days to go",
    template: "launch-reminder",
    applicationId,
    html: emailWrapper(`
      <h2 style="color: #0f172a;">Launch day is approaching, ${name}!</h2>
      <p>Your planned launch date for <strong>${projectName}</strong> is ${launchDate} — about 30 days away.</p>
      <p>Make sure your domain, landing page, and product are ready to go.</p>
    `),
  });
}

export async function sendLaunchFollowUpEmail(
  to: string,
  name: string,
  projectName: string,
  applicationId: string
) {
  return sendEmail({
    to,
    subject: "How did your launch go?",
    template: "launch-follow-up",
    applicationId,
    html: emailWrapper(`
      <h2 style="color: #0f172a;">Hi ${name},</h2>
      <p>We hope your launch for <strong>${projectName}</strong> went well!</p>
      <p>We'd love to hear about your progress. Reply to this email or share an update — we'd be happy to feature your launch story.</p>
    `),
  });
}
