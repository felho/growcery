import { bigint, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../utils";

export const organizations = createTable("organizations", {
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 250 }).notNull(),
});
