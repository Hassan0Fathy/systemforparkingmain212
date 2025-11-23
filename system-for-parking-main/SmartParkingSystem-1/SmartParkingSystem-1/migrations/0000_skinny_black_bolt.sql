CREATE TABLE "cars" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plate_number" text NOT NULL,
	"owner_name" text NOT NULL,
	"qr_value" text NOT NULL,
	"qr_code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cars_plate_number_unique" UNIQUE("plate_number"),
	CONSTRAINT "cars_qr_value_unique" UNIQUE("qr_value")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'customer' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "visits" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"car_id" varchar NOT NULL,
	"plate_number" text NOT NULL,
	"owner_name" text NOT NULL,
	"check_in_time" timestamp NOT NULL,
	"check_out_time" timestamp,
	"duration" integer,
	"fee" integer,
	"is_checked_in" boolean DEFAULT true NOT NULL
);
