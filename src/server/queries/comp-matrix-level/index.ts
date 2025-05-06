import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { compMatrixLevels } from "~/server/db/schema";

export type CompMatrixLevel = InferSelectModel<typeof compMatrixLevels>;

export type NewCompMatrixLevel = InferInsertModel<typeof compMatrixLevels>;
