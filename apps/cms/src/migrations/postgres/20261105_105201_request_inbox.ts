import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_support_requests_source" AS ENUM('website', 'phone', 'whatsapp', 'staff-follow-up', 'legacy');
  CREATE TYPE "public"."enum_request_activity_kind" AS ENUM('note', 'status');
  CREATE TABLE "request_activity" (
    "id" serial PRIMARY KEY NOT NULL,
    "request_id" integer,
    "kind" "enum_request_activity_kind" NOT NULL,
    "text" varchar NOT NULL,
    "author_id" integer,
    "author_name" varchar NOT NULL,
    "from_status" varchar,
    "to_status" varchar,
    "transition_key" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "support_requests" ADD COLUMN "workflow_revision" varchar DEFAULT 'legacy';
  ALTER TABLE "support_requests" ADD COLUMN "source" "enum_support_requests_source" DEFAULT 'legacy';
  ALTER TABLE "support_requests" ADD COLUMN "captured_by_id" integer;
  ALTER TABLE "support_requests" ADD COLUMN "captured_by_name" varchar;
  ALTER TABLE "support_requests" ADD COLUMN "original_request_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "request_activity_id" integer;
  ALTER TABLE "request_activity" ADD CONSTRAINT "request_activity_request_id_support_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."support_requests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "request_activity" ADD CONSTRAINT "request_activity_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "request_activity_request_idx" ON "request_activity" USING btree ("request_id");
  CREATE INDEX "request_activity_author_idx" ON "request_activity" USING btree ("author_id");
  CREATE UNIQUE INDEX "request_activity_transition_key_idx" ON "request_activity" USING btree ("transition_key");
  CREATE INDEX "request_activity_updated_at_idx" ON "request_activity" USING btree ("updated_at");
  CREATE INDEX "request_activity_created_at_idx" ON "request_activity" USING btree ("created_at");
  ALTER TABLE "support_requests" ADD CONSTRAINT "support_requests_captured_by_id_users_id_fk" FOREIGN KEY ("captured_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "support_requests" ADD CONSTRAINT "support_requests_original_request_id_support_requests_id_fk" FOREIGN KEY ("original_request_id") REFERENCES "public"."support_requests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_request_activity_fk" FOREIGN KEY ("request_activity_id") REFERENCES "public"."request_activity"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "support_requests_captured_by_idx" ON "support_requests" USING btree ("captured_by_id");
  CREATE INDEX "support_requests_original_request_idx" ON "support_requests" USING btree ("original_request_id");
  CREATE INDEX "payload_locked_documents_rels_request_activity_id_idx" ON "payload_locked_documents_rels" USING btree ("request_activity_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "request_activity" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "request_activity" CASCADE;
  ALTER TABLE "support_requests" DROP CONSTRAINT "support_requests_captured_by_id_users_id_fk";

  ALTER TABLE "support_requests" DROP CONSTRAINT "support_requests_original_request_id_support_requests_id_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_request_activity_fk";

  DROP INDEX "support_requests_captured_by_idx";
  DROP INDEX "support_requests_original_request_idx";
  DROP INDEX "payload_locked_documents_rels_request_activity_id_idx";
  ALTER TABLE "support_requests" DROP COLUMN "workflow_revision";
  ALTER TABLE "support_requests" DROP COLUMN "source";
  ALTER TABLE "support_requests" DROP COLUMN "captured_by_id";
  ALTER TABLE "support_requests" DROP COLUMN "captured_by_name";
  ALTER TABLE "support_requests" DROP COLUMN "original_request_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "request_activity_id";
  DROP TYPE "public"."enum_support_requests_source";
  DROP TYPE "public"."enum_request_activity_kind";`)
}
