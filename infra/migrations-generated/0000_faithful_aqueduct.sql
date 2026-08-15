CREATE TABLE "authority_events" (
	"event_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identity_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"scope" jsonb NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "decision_records" (
	"decision_id" uuid PRIMARY KEY NOT NULL,
	"identity_id" uuid,
	"resolved_action" jsonb NOT NULL,
	"authority_context" jsonb NOT NULL,
	"policy_judgment" jsonb NOT NULL,
	"outcome" text NOT NULL,
	"complete" boolean NOT NULL,
	"decided_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identities" (
	"identity_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"origin_reference" jsonb NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "policy_rules" (
	"rule_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" text NOT NULL,
	"version" integer NOT NULL,
	"rego_source" text NOT NULL,
	"authored_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "policy_rules_category_version_key" UNIQUE("category","version")
);
--> statement-breakpoint
ALTER TABLE "authority_events" ADD CONSTRAINT "authority_events_identity_id_identities_identity_id_fk" FOREIGN KEY ("identity_id") REFERENCES "public"."identities"("identity_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_records" ADD CONSTRAINT "decision_records_identity_id_identities_identity_id_fk" FOREIGN KEY ("identity_id") REFERENCES "public"."identities"("identity_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "authority_events_identity_idx" ON "authority_events" USING btree ("identity_id","occurred_at");