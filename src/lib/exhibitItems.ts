"use server";
import { db } from "@/db/drizzle";
import { exhibitItems } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

// 🔁 Use Drizzle-generated types
export type ExhibitItemInput = Omit<
  InferInsertModel<typeof exhibitItems>,
  "ownerId"
>;
export type ExhibitItem = InferSelectModel<typeof exhibitItems>;

export async function addExhibitItem(input: ExhibitItemInput) {
  const { orgId } = await auth();
  if (!orgId) {
    throw new Error("No organization ID found in auth");
  }
  await db.insert(exhibitItems).values({ ...input, ownerId: orgId });
}

export async function getExhibitItems(): Promise<ExhibitItem[]> {
  const { orgId } = await auth();
  if (!orgId) {
    throw new Error("No organization ID found in auth");
  }
  return db
    .select()
    .from(exhibitItems)
    .where(and(eq(exhibitItems.ownerId, orgId)));
}

export async function getExhibitItemById(id: string): Promise<ExhibitItem[]> {
  const { orgId } = await auth();
  if (!orgId) {
    throw new Error("No organization ID found in auth");
  }
  const item = await db
    .select()
    .from(exhibitItems)
    .where(
      and(eq(exhibitItems.ownerId, orgId), eq(exhibitItems.itemNumber, id))
    )

  if (!item || item.length === 0) {
    throw new Error("Item not found");
  }
  return item;
}
