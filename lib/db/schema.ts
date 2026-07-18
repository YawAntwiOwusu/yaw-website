import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const applicationStatusEnum = pgEnum("application_status", [
  "new",
  "under_review",
  "shortlisted",
  "winner",
  "archived",
]);

export const cycleStatusEnum = pgEnum("cycle_status", [
  "open",
  "closed",
  "review",
  "complete",
]);

export const domainRegistrationStatusEnum = pgEnum("domain_registration_status", [
  "pending",
  "registered",
  "failed",
  "manual_required",
]);

export const emailStatusEnum = pgEnum("email_status", [
  "sent",
  "failed",
  "skipped",
]);

export const postStatusEnum = pgEnum("post_status", ["draft", "published"]);

export const commentStatusEnum = pgEnum("comment_status", [
  "pending",
  "approved",
  "spam",
  "rejected",
]);

export const applicationCycles = pgTable("application_cycles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  applicationsOpenAt: timestamp("applications_open_at").notNull(),
  applicationsCloseAt: timestamp("applications_close_at").notNull(),
  reviewStartsAt: timestamp("review_starts_at"),
  winnerAnnouncedAt: timestamp("winner_announced_at"),
  status: cycleStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  cycleId: uuid("cycle_id")
    .references(() => applicationCycles.id)
    .notNull(),
  status: applicationStatusEnum("status").notNull().default("new"),

  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  country: text("country").notNull(),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  website: text("website"),

  bio: text("bio").notNull(),
  experience: text("experience"),
  industry: text("industry").notNull(),

  projectName: text("project_name").notNull(),
  projectSlug: text("project_slug").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  launchStage: text("launch_stage").notNull(),
  demoUrl: text("demo_url"),
  prototypeNotes: text("prototype_notes"),
  prototypeFileUrl: text("prototype_file_url"),

  desiredDomain: text("desired_domain").notNull(),
  domainAlternatives: jsonb("domain_alternatives").$type<string[]>().default([]),
  estimatedPrice: text("estimated_price"),
  launchTimeline: text("launch_timeline").notNull(),
  launchDate: timestamp("launch_date"),
  motivation: text("motivation").notNull(),

  optIntoBuilderWall: boolean("opt_into_builder_wall").default(false).notNull(),
  builderWallPublic: boolean("builder_wall_public").default(false).notNull(),

  scoreProductReadiness: integer("score_product_readiness"),
  scoreImpact: integer("score_impact"),
  scoreVision: integer("score_vision"),
  scoreExecution: integer("score_execution"),
  scoreLaunchReadiness: integer("score_launch_readiness"),
  overallScore: integer("overall_score"),
  internalNotes: text("internal_notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const founders = pgTable("founders", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id").references(() => applications.id),
  name: text("name").notNull(),
  startup: text("startup").notNull(),
  industry: text("industry"),
  country: text("country"),
  linkedin: text("linkedin"),
  website: text("website"),
  domain: text("domain"),
  launchDate: timestamp("launch_date"),
  notes: text("notes"),
  alumniStatus: boolean("alumni_status").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const winners = pgTable("winners", {
  id: uuid("id").defaultRandom().primaryKey(),
  founderId: uuid("founder_id").references(() => founders.id),
  applicationId: uuid("application_id").references(() => applications.id),
  cycleId: uuid("cycle_id").references(() => applicationCycles.id),
  slug: text("slug").notNull().unique(),
  projectName: text("project_name").notNull(),
  founderName: text("founder_name").notNull(),
  domain: text("domain").notNull(),
  launchDate: timestamp("launch_date"),
  story: text("story"),
  website: text("website"),
  featuredImage: text("featured_image"),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const winnerUpdates = pgTable("winner_updates", {
  id: uuid("id").defaultRandom().primaryKey(),
  winnerId: uuid("winner_id")
    .references(() => winners.id)
    .notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const domainRegistrations = pgTable("domain_registrations", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id")
    .references(() => applications.id)
    .notNull(),
  domain: text("domain").notNull(),
  tld: text("tld").notNull(),
  namecheapOrderId: text("namecheap_order_id"),
  status: domainRegistrationStatusEnum("status").notNull().default("pending"),
  registeredAt: timestamp("registered_at"),
  assignedToFounderAccount: boolean("assigned_to_founder_account")
    .default(false)
    .notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const emailLogs = pgTable("email_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id").references(() => applications.id),
  template: text("template").notNull(),
  recipient: text("recipient").notNull(),
  status: emailStatusEnum("status").notNull().default("sent"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  errorMessage: text("error_message"),
});

export const statusAuditLogs = pgTable("status_audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id")
    .references(() => applications.id)
    .notNull(),
  fromStatus: applicationStatusEnum("from_status"),
  toStatus: applicationStatusEnum("to_status").notNull(),
  changedBy: text("changed_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Site CMS: blog posts (formerly Notes). */
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull().default(""),
  featuredImageUrl: text("featured_image_url").notNull().default(""),
  author: text("author"),
  status: postStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Site CMS: portfolio projects. */
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  year: text("year").notNull(),
  description: text("description"),
  image: text("image").notNull(),
  href: text("href").notNull(),
  internal: boolean("internal").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  pathname: text("pathname").notNull(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type"),
  size: integer("size"),
  width: integer("width"),
  height: integer("height"),
  alt: text("alt"),
  productSlug: text("product_slug"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  body: text("body").notNull(),
  status: commentStatusEnum("status").notNull().default("pending"),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type").notNull().default("pageview"),
  path: text("path").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  sessionId: text("session_id"),
  productSlug: text("product_slug"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type Founder = typeof founders.$inferSelect;
export type Winner = typeof winners.$inferSelect;
export type ApplicationCycle = typeof applicationCycles.$inferSelect;
export type DomainRegistration = typeof domainRegistrations.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type ProjectRow = typeof projects.$inferSelect;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
