import { eq } from "drizzle-orm";
import {
  requireDb,
  applications,
  applicationCycles,
  founders,
} from "@/lib/firstdomain/db";
import { applicationFormSchema } from "@/lib/firstdomain/types/application";
import { sendApplicationReceivedEmail } from "@/lib/firstdomain/email/send";
import { slugify } from "@/lib/utils";

export type SubmitApplicationResult =
  | { success: true; applicationId: string }
  | { success: false; error: string };

export async function submitApplication(
  data: unknown
): Promise<SubmitApplicationResult> {
  const parsed = applicationFormSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid form data",
    };
  }

  const form = parsed.data;
  const db = requireDb();

  const [openCycle] = await db
    .select()
    .from(applicationCycles)
    .where(eq(applicationCycles.status, "open"))
    .limit(1);

  if (!openCycle) {
    return {
      success: false,
      error: "Applications are currently closed. Please check back later.",
    };
  }

  const projectSlug = slugify(form.projectName);

  const [application] = await db
    .insert(applications)
    .values({
      cycleId: openCycle.id,
      fullName: form.fullName,
      email: form.email,
      country: form.country,
      linkedin: form.linkedin || null,
      twitter: form.twitter || null,
      website: form.website || null,
      bio: form.bio,
      experience: form.experience || null,
      industry: form.industry,
      projectName: form.projectName,
      projectSlug,
      description: form.description,
      category: form.category,
      launchStage: form.launchStage,
      demoUrl: form.demoUrl || null,
      prototypeNotes: form.prototypeNotes || null,
      prototypeFileUrl: form.prototypeFileUrl || null,
      desiredDomain: form.desiredDomain,
      domainAlternatives: form.domainAlternatives,
      estimatedPrice: form.estimatedPrice || null,
      launchTimeline: form.launchTimeline,
      motivation: form.motivation,
      optIntoBuilderWall: form.optIntoBuilderWall,
      builderWallPublic: form.builderWallPublic,
    })
    .returning();

  await db.insert(founders).values({
    applicationId: application.id,
    name: form.fullName,
    startup: form.projectName,
    industry: form.industry,
    country: form.country,
    linkedin: form.linkedin || null,
    website: form.website || null,
    domain: form.desiredDomain,
  });

  await sendApplicationReceivedEmail(
    form.email,
    form.fullName,
    form.projectName,
    application.id
  );

  return { success: true, applicationId: application.id };
}

export async function getOpenCycle() {
  const db = requireDb();
  const [cycle] = await db
    .select()
    .from(applicationCycles)
    .where(eq(applicationCycles.status, "open"))
    .limit(1);
  return cycle ?? null;
}
