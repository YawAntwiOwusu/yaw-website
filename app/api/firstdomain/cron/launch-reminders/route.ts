import { NextResponse } from "next/server";
import { eq, and, gte, lte, isNotNull } from "drizzle-orm";
import { requireDb, applications } from "@/lib/firstdomain/db";
import {
  sendLaunchReminderEmail,
  sendLaunchFollowUpEmail,
} from "@/lib/firstdomain/email/send";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 }
    );
  }

  const db = requireDb();
  const now = new Date();

  const thirtyDaysFromNow = new Date(now);
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const thirtyDaysStart = new Date(thirtyDaysFromNow);
  thirtyDaysStart.setHours(0, 0, 0, 0);
  const thirtyDaysEnd = new Date(thirtyDaysFromNow);
  thirtyDaysEnd.setHours(23, 59, 59, 999);

  const launchReminders = await db
    .select()
    .from(applications)
    .where(
      and(
        isNotNull(applications.launchDate),
        gte(applications.launchDate, thirtyDaysStart),
        lte(applications.launchDate, thirtyDaysEnd),
        eq(applications.status, "winner")
      )
    );

  for (const app of launchReminders) {
    if (app.launchDate) {
      await sendLaunchReminderEmail(
        app.email,
        app.fullName,
        app.projectName,
        app.launchDate.toLocaleDateString(),
        app.id
      );
    }
  }

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysStart = new Date(sevenDaysAgo);
  sevenDaysStart.setHours(0, 0, 0, 0);
  const sevenDaysEnd = new Date(sevenDaysAgo);
  sevenDaysEnd.setHours(23, 59, 59, 999);

  const launchFollowUps = await db
    .select()
    .from(applications)
    .where(
      and(
        isNotNull(applications.launchDate),
        gte(applications.launchDate, sevenDaysStart),
        lte(applications.launchDate, sevenDaysEnd),
        eq(applications.status, "winner")
      )
    );

  for (const app of launchFollowUps) {
    await sendLaunchFollowUpEmail(
      app.email,
      app.fullName,
      app.projectName,
      app.id
    );
  }

  return NextResponse.json({
    reminders: launchReminders.length,
    followUps: launchFollowUps.length,
  });
}
