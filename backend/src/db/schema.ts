import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

/**
 * Users table - stores user authentication and profile information
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  profilePicture: text("profile_picture"),
  googleId: varchar("google_id", { length: 255 }).unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Diaries table - stores diary profiles created by users
 */
export const diaries = pgTable("diaries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  uniqueLink: varchar("unique_link", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  settings: jsonb("settings").default(sql`'{}'::jsonb`).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Farewell notes table - stores encrypted notes written by friends
 */
export const farewellNotes = pgTable("farewell_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  diaryId: uuid("diary_id")
    .notNull()
    .references(() => diaries.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => users.id, {
    onDelete: "set null",
  }),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorEmail: varchar("author_email", { length: 255 }).notNull(),
  encryptedContent: text("encrypted_content").notNull(),
  fontStyle: varchar("font_style", { length: 50 }).default("default"),
  isAnonymous: boolean("is_anonymous").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Sessions table - stores user sessions for authentication
 */
export const sessions = pgTable("sessions", {
  sid: varchar("sid", { length: 255 }).primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

/**
 * Relations
 */
export const usersRelations = relations(users, ({ many, one }) => ({
  diary: one(diaries, {
    fields: [users.id],
    references: [diaries.userId],
  }),
  writtenNotes: many(farewellNotes),
}));

export const diariesRelations = relations(diaries, ({ one, many }) => ({
  owner: one(users, {
    fields: [diaries.userId],
    references: [users.id],
  }),
  notes: many(farewellNotes),
}));

export const farewellNotesRelations = relations(farewellNotes, ({ one }) => ({
  diary: one(diaries, {
    fields: [farewellNotes.diaryId],
    references: [diaries.id],
  }),
  author: one(users, {
    fields: [farewellNotes.authorId],
    references: [users.id],
  }),
}));

/**
 * Types
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Diary = typeof diaries.$inferSelect;
export type NewDiary = typeof diaries.$inferInsert;

export type FarewellNote = typeof farewellNotes.$inferSelect;
export type NewFarewellNote = typeof farewellNotes.$inferInsert;
