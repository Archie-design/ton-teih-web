CREATE TABLE IF NOT EXISTS "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"product" text DEFAULT '' NOT NULL,
	"equipment_id" text DEFAULT '' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"status" text DEFAULT '待回覆' NOT NULL,
	"admin_note" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "machines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"brand" text DEFAULT '' NOT NULL,
	"model" text DEFAULT '' NOT NULL,
	"year" integer DEFAULT 2020 NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"cost_price" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'TWD' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"category" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"hours_used" integer DEFAULT 0 NOT NULL,
	"controller" text DEFAULT '' NOT NULL,
	"pump_system" text DEFAULT '' NOT NULL,
	"is_official" boolean DEFAULT false NOT NULL,
	"inspection_score" integer DEFAULT 0 NOT NULL,
	"thumbnail" text DEFAULT '' NOT NULL,
	"gallery" text[] DEFAULT '{}'::text[] NOT NULL,
	"trading_status" text DEFAULT '待售' NOT NULL,
	"specs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seller_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"machine_brand" text DEFAULT '' NOT NULL,
	"machine_model" text DEFAULT '' NOT NULL,
	"machine_year" text DEFAULT '' NOT NULL,
	"machine_hours" text DEFAULT '' NOT NULL,
	"machine_price" text DEFAULT '' NOT NULL,
	"machine_location" text DEFAULT '' NOT NULL,
	"machine_condition" text DEFAULT '' NOT NULL,
	"status" text DEFAULT '待聯繫' NOT NULL,
	"admin_note" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inquiries_status_created_idx" ON "inquiries" USING btree ("status","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "machines_created_at_idx" ON "machines" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "machines_category_active_idx" ON "machines" USING btree ("category","is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "seller_requests_status_created_idx" ON "seller_requests" USING btree ("status","created_at" DESC NULLS LAST);