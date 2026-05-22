ALTER TABLE "user" RENAME COLUMN "image" TO "image_url";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "image_public_id" text;