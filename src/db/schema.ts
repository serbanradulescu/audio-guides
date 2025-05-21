import { text, pgTable } from "drizzle-orm/pg-core";

export const exhibitItems = pgTable("exhibit_items", {
  ownerId: text("owner_id").notNull(), // e.g. 'user_id' or 'exhibit_id'
  itemNumber: text("item_number").notNull(),
  language: text("language").notNull(), // e.g. 'en', 'fr', 'ro'
  title: text("title").notNull(),
  description: text("description").notNull(),
  audioUrl: text("audio_url"), // Optional
});
