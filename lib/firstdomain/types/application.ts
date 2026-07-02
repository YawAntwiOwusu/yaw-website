import { z } from "zod";
import {
  FIRSTDOMAIN_CATEGORIES,
  FIRSTDOMAIN_LAUNCH_STAGES,
  FIRSTDOMAIN_LAUNCH_TIMELINES,
} from "./index";

export const applicationFormSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  country: z.string().min(2, "Country is required"),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),

  bio: z.string().min(50, "Tell us more about yourself (min 50 chars)"),
  experience: z.string().optional(),
  industry: z.string().min(2, "Industry is required"),

  projectName: z.string().min(2, "Project name is required"),
  description: z.string().min(100, "Describe your startup (min 100 chars)"),
  category: z.enum(FIRSTDOMAIN_CATEGORIES),
  launchStage: z.enum(FIRSTDOMAIN_LAUNCH_STAGES),
  demoUrl: z.string().url().optional().or(z.literal("")),
  prototypeNotes: z.string().optional(),
  prototypeFileUrl: z.string().optional(),

  desiredDomain: z.string().min(3, "Select a desired domain"),
  domainAlternatives: z.array(z.string()),
  estimatedPrice: z.string().optional(),
  launchTimeline: z.enum(FIRSTDOMAIN_LAUNCH_TIMELINES),
  motivation: z.string().min(50, "Share your motivation (min 50 chars)"),

  optIntoBuilderWall: z.boolean(),
  builderWallPublic: z.boolean(),
  consent: z.literal(true, { message: "You must agree to continue" }),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;

export const scoringSchema = z.object({
  scoreProductReadiness: z.number().min(1).max(10).nullable(),
  scoreImpact: z.number().min(1).max(10).nullable(),
  scoreVision: z.number().min(1).max(10).nullable(),
  scoreExecution: z.number().min(1).max(10).nullable(),
  scoreLaunchReadiness: z.number().min(1).max(10).nullable(),
  internalNotes: z.string().optional(),
  status: z.enum([
    "new",
    "under_review",
    "shortlisted",
    "winner",
    "archived",
  ]),
});

export type ScoringFormData = z.infer<typeof scoringSchema>;
