CREATE TYPE "public"."application_status" AS ENUM('new', 'under_review', 'shortlisted', 'winner', 'archived');--> statement-breakpoint
CREATE TYPE "public"."cycle_status" AS ENUM('open', 'closed', 'review', 'complete');--> statement-breakpoint
CREATE TYPE "public"."domain_registration_status" AS ENUM('pending', 'registered', 'failed', 'manual_required');--> statement-breakpoint
CREATE TYPE "public"."email_status" AS ENUM('sent', 'failed', 'skipped');--> statement-breakpoint
CREATE TABLE "application_cycles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"applications_open_at" timestamp NOT NULL,
	"applications_close_at" timestamp NOT NULL,
	"review_starts_at" timestamp,
	"winner_announced_at" timestamp,
	"status" "cycle_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid NOT NULL,
	"status" "application_status" DEFAULT 'new' NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"country" text NOT NULL,
	"linkedin" text,
	"twitter" text,
	"website" text,
	"bio" text NOT NULL,
	"experience" text,
	"industry" text NOT NULL,
	"project_name" text NOT NULL,
	"project_slug" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"launch_stage" text NOT NULL,
	"demo_url" text,
	"prototype_notes" text,
	"prototype_file_url" text,
	"desired_domain" text NOT NULL,
	"domain_alternatives" jsonb DEFAULT '[]'::jsonb,
	"estimated_price" text,
	"launch_timeline" text NOT NULL,
	"launch_date" timestamp,
	"motivation" text NOT NULL,
	"opt_into_builder_wall" boolean DEFAULT false NOT NULL,
	"builder_wall_public" boolean DEFAULT false NOT NULL,
	"score_product_readiness" integer,
	"score_impact" integer,
	"score_vision" integer,
	"score_execution" integer,
	"score_launch_readiness" integer,
	"overall_score" integer,
	"internal_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domain_registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"domain" text NOT NULL,
	"tld" text NOT NULL,
	"namecheap_order_id" text,
	"status" "domain_registration_status" DEFAULT 'pending' NOT NULL,
	"registered_at" timestamp,
	"assigned_to_founder_account" boolean DEFAULT false NOT NULL,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid,
	"template" text NOT NULL,
	"recipient" text NOT NULL,
	"status" "email_status" DEFAULT 'sent' NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"error_message" text
);
--> statement-breakpoint
CREATE TABLE "founders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid,
	"name" text NOT NULL,
	"startup" text NOT NULL,
	"industry" text,
	"country" text,
	"linkedin" text,
	"website" text,
	"domain" text,
	"launch_date" timestamp,
	"notes" text,
	"alumni_status" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "status_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"from_status" "application_status",
	"to_status" "application_status" NOT NULL,
	"changed_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "winner_updates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"winner_id" uuid NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "winners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"founder_id" uuid,
	"application_id" uuid,
	"cycle_id" uuid,
	"slug" text NOT NULL,
	"project_name" text NOT NULL,
	"founder_name" text NOT NULL,
	"domain" text NOT NULL,
	"launch_date" timestamp,
	"story" text,
	"website" text,
	"featured_image" text,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "winners_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_cycle_id_application_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."application_cycles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domain_registrations" ADD CONSTRAINT "domain_registrations_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "founders" ADD CONSTRAINT "founders_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_audit_logs" ADD CONSTRAINT "status_audit_logs_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "winner_updates" ADD CONSTRAINT "winner_updates_winner_id_winners_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."winners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "winners" ADD CONSTRAINT "winners_founder_id_founders_id_fk" FOREIGN KEY ("founder_id") REFERENCES "public"."founders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "winners" ADD CONSTRAINT "winners_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "winners" ADD CONSTRAINT "winners_cycle_id_application_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."application_cycles"("id") ON DELETE no action ON UPDATE no action;