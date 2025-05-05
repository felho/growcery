import { type InferSelectModel } from "drizzle-orm";
import { userArchetypes } from "~/server/db/schema/tables/user-archetypes";
import { getAllUserArchetypesForOrg } from "./get-all";
import { getUserArchetypeById } from "./get-by-id";

export type UserArchetype = InferSelectModel<typeof userArchetypes>;

export { getAllUserArchetypesForOrg, getUserArchetypeById };
