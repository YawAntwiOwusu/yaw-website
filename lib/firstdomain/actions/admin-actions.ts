"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  requireDb,
  applications,
  founders,
  winners,
  domainRegistrations,
  statusAuditLogs,
  applicationCycles,
  winnerUpdates,
} from "@/lib/firstdomain/db";
import { requireAdmin } from "@/lib/firstdomain/auth/admin";
import {
  sendUnderReviewEmail,
  sendWinnerSelectedEmail,
  sendDomainRegisteredEmail,
} from "@/lib/firstdomain/email/send";
import { registerDomain } from "@/lib/firstdomain/namecheap/client";
import { slugify } from "@/lib/utils";
import type { ApplicationStatus, CycleStatus } from "@/lib/firstdomain/types";

function computeOverallScore(scores: {
  scoreProductReadiness?: number | null;
  scoreImpact?: number | null;
  scoreVision?: number | null;
  scoreExecution?: number | null;
  scoreLaunchReadiness?: number | null;
}): number | null {
  const values = [
    scores.scoreProductReadiness,
    scores.scoreImpact,
    scores.scoreVision,
    scores.scoreExecution,
    scores.scoreLaunchReadiness,
  ].filter((v): v is number => v != null);

  if (values.length === 0) return null;
  return Math.round(
    values.reduce((a, b) => a + b, 0) / values.length
  );
}

export async function updateApplicationReview(
  applicationId: string,
  data: {
    status: ApplicationStatus;
    scoreProductReadiness?: number | null;
    scoreImpact?: number | null;
    scoreVision?: number | null;
    scoreExecution?: number | null;
    scoreLaunchReadiness?: number | null;
    internalNotes?: string;
    builderWallPublic?: boolean;
  }
) {
  await requireAdmin();
  const db = requireDb();

  const [existing] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);

  if (!existing) throw new Error("Application not found");

  const overallScore = computeOverallScore(data);

  await db
    .update(applications)
    .set({
      status: data.status,
      scoreProductReadiness: data.scoreProductReadiness,
      scoreImpact: data.scoreImpact,
      scoreVision: data.scoreVision,
      scoreExecution: data.scoreExecution,
      scoreLaunchReadiness: data.scoreLaunchReadiness,
      overallScore,
      internalNotes: data.internalNotes,
      builderWallPublic: data.builderWallPublic,
      updatedAt: new Date(),
    })
    .where(eq(applications.id, applicationId));

  if (existing.status !== data.status) {
    await db.insert(statusAuditLogs).values({
      applicationId,
      fromStatus: existing.status,
      toStatus: data.status,
      changedBy: "admin",
    });

    if (data.status === "under_review") {
      await sendUnderReviewEmail(
        existing.email,
        existing.fullName,
        existing.projectName,
        applicationId
      );
    }

    if (data.status === "winner") {
      await sendWinnerSelectedEmail(
        existing.email,
        existing.fullName,
        existing.projectName,
        existing.desiredDomain,
        applicationId
      );

      const slug = slugify(existing.projectName);
      await db.insert(winners).values({
        applicationId,
        cycleId: existing.cycleId,
        slug: `${slug}-${Date.now().toString(36)}`,
        projectName: existing.projectName,
        founderName: existing.fullName,
        domain: existing.desiredDomain,
        website: existing.website,
        published: false,
      });

      await db.insert(domainRegistrations).values({
        applicationId,
        domain: existing.desiredDomain,
        tld: existing.desiredDomain.split(".").slice(1).join("."),
        status: "pending",
      });

      await db
        .update(founders)
        .set({ alumniStatus: true, domain: existing.desiredDomain })
        .where(eq(founders.applicationId, applicationId));
    }
  }

  revalidatePath("/firstdomain/admin/applications");
  revalidatePath(`/firstdomain/admin/applications/${applicationId}`);
  return { success: true };
}

export async function registerDomainForApplication(applicationId: string) {
  await requireAdmin();
  const db = requireDb();

  const [registration] = await db
    .select()
    .from(domainRegistrations)
    .where(eq(domainRegistrations.applicationId, applicationId))
    .limit(1);

  if (!registration) throw new Error("No domain registration found");

  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);

  if (!application) throw new Error("Application not found");

  const result = await registerDomain(registration.domain);

  if (result.success) {
    await db
      .update(domainRegistrations)
      .set({
        status: "registered",
        namecheapOrderId: result.orderId,
        registeredAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(domainRegistrations.id, registration.id));

    await sendDomainRegisteredEmail(
      application.email,
      application.fullName,
      registration.domain,
      applicationId
    );
  } else {
    await db
      .update(domainRegistrations)
      .set({
        status: "failed",
        errorMessage: result.error,
        updatedAt: new Date(),
      })
      .where(eq(domainRegistrations.id, registration.id));
  }

  revalidatePath("/firstdomain/admin/domains");
  return result;
}

export async function updateCycleStatus(cycleId: string, status: CycleStatus) {
  await requireAdmin();
  const db = requireDb();

  await db
    .update(applicationCycles)
    .set({ status, updatedAt: new Date() })
    .where(eq(applicationCycles.id, cycleId));

  revalidatePath("/firstdomain/admin");
  return { success: true };
}

export async function publishWinner(winnerId: string, story: string) {
  await requireAdmin();
  const db = requireDb();

  await db
    .update(winners)
    .set({ published: true, story, updatedAt: new Date() })
    .where(eq(winners.id, winnerId));

  revalidatePath("/firstdomain/winners");
  return { success: true };
}

export async function addWinnerUpdate(
  winnerId: string,
  title: string,
  body: string
) {
  await requireAdmin();
  const db = requireDb();

  await db.insert(winnerUpdates).values({
    winnerId,
    title,
    body,
  });

  revalidatePath("/firstdomain/admin/content");
  return { success: true };
}

export async function exportFoundersCsv(): Promise<string> {
  await requireAdmin();
  const db = requireDb();

  const allFounders = await db.select().from(founders);

  const headers = [
    "Name",
    "Startup",
    "Industry",
    "Country",
    "LinkedIn",
    "Website",
    "Domain",
    "Launch Date",
    "Alumni",
    "Notes",
  ];

  const rows = allFounders.map((f) =>
    [
      f.name,
      f.startup,
      f.industry || "",
      f.country || "",
      f.linkedin || "",
      f.website || "",
      f.domain || "",
      f.launchDate?.toISOString().split("T")[0] || "",
      f.alumniStatus ? "Yes" : "No",
      (f.notes || "").replace(/"/g, '""'),
    ]
      .map((v) => `"${v}"`)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}
