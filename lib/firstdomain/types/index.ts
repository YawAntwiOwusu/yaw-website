export const FIRSTDOMAIN_SUPPORTED_TLDS = [
  ".com",
  ".dev",
  ".app",
  ".io",
  ".co",
  ".net",
  ".org",
] as const;

export const FIRSTDOMAIN_CATEGORIES = [
  "SaaS",
  "Consumer",
  "Fintech",
  "Health",
  "Education",
  "Developer Tools",
  "Marketplace",
  "Other",
] as const;

export const FIRSTDOMAIN_LAUNCH_STAGES = [
  "Idea",
  "Prototype",
  "Beta",
  "Live",
] as const;

export const FIRSTDOMAIN_LAUNCH_TIMELINES = [
  "Within 30 days",
  "1–3 months",
  "3–6 months",
  "6+ months",
] as const;

export type ApplicationStatus =
  | "new"
  | "under_review"
  | "shortlisted"
  | "winner"
  | "archived";

export type CycleStatus = "open" | "closed" | "review" | "complete";

export type EmailTemplate =
  | "application-received"
  | "application-under-review"
  | "winner-selected"
  | "domain-registered"
  | "launch-reminder"
  | "launch-follow-up";
