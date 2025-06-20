import { primaryKey, varchar, bigint } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { organizations } from "./organizations";

export const orgEmailDomain = createTable(
  "org_email_domains",
  {
    organizationId: bigint("organization_id", { mode: "number" })
      .notNull()
      .references(() => organizations.id),
    emailDomain: varchar("email_domain", { length: 500 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.organizationId, table.emailDomain] }),
  ],
);
