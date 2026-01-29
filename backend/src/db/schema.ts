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
 * =========================
 * USERS TABLE
 * =========================
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),

  // ✅ MUST be nullable for OAuth
  googleId: varchar("google_id", { length: 255 }).unique(),
  profilePicture: text("profile_picture"),

  isActive: boolean("is_active").notNull().default(true),

  // ✅ Supabase expects timestamptz
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * =========================
 * DIARIES TABLE
 * =========================
 */
export const diaries = pgTable("diaries", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  uniqueLink: varchar("unique_link", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),

  isActive: boolean("is_active").notNull().default(true),

  settings: jsonb("settings")
    .notNull()
    .default(sql`'{}'::jsonb`),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * =========================
 * FAREWELL NOTES TABLE
 * =========================
 */
export const farewellNotes = pgTable("farewell_notes", {
  id: uuid("id").defaultRandom().primaryKey(),

  diaryId: uuid("diary_id")
    .notNull()
    .references(() => diaries.id, { onDelete: "cascade" }),

  // nullable for anonymous notes
  authorId: uuid("author_id").references(() => users.id, {
    onDelete: "set null",
  }),

  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorEmail: varchar("author_email", { length: 255 }).notNull(),

  encryptedContent: text("encrypted_content").notNull(),

  fontStyle: varchar("font_style", { length: 50 })
    .notNull()
    .default("default"),

  isAnonymous: boolean("is_anonymous").notNull().default(false),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * =========================
 * SESSIONS TABLE (Render)
 * =========================
 */
export const sessions = pgTable("sessions", {
  sid: varchar("sid", { length: 255 }).primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire", { withTimezone: true }).notNull(),
});

/**
 * =========================
 * TESTIMONIALS TABLE (NEW)
 * =========================
 */
export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Optional - can be null for anonymous testimonials
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "set null",
  }),

  name: varchar("name", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isApproved: boolean("is_approved").notNull().default(false), // Admin moderation

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * =========================
 * DONATIONS TABLE (NEW)
 * =========================
 */
export const donations = pgTable("donations", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Optional - can be null for anonymous donations
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "set null",
  }),

  // Display information (sanitized)
  displayName: varchar("display_name", { length: 255 }).notNull(),
  amount: varchar("amount", { length: 50 }).notNull(), // e.g., "$10", "₹500"
  message: text("message"), // Optional message

  // Internal tracking (NOT exposed publicly)
  paymentProvider: varchar("payment_provider", { length: 50 }), // "stripe", "razorpay"
  transactionId: varchar("transaction_id", { length: 255 }), // External payment ID

  isAnonymous: boolean("is_anonymous").notNull().default(false),
  isPublic: boolean("is_public").notNull().default(true), // Show in public list

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * =========================
 * RELATIONS
 * =========================
 */
export const usersRelations = relations(users, ({ many }) => ({
  diaries: many(diaries),
  writtenNotes: many(farewellNotes),
  testimonials: many(testimonials),
  donations: many(donations),
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

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  user: one(users, {
    fields: [testimonials.userId],
    references: [users.id],
  }),
}));

export const donationsRelations = relations(donations, ({ one }) => ({
  user: one(users, {
    fields: [donations.userId],
    references: [users.id],
  }),
}));

/**
 * =========================
 * TYPES
 * =========================
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Diary = typeof diaries.$inferSelect;
export type NewDiary = typeof diaries.$inferInsert;

export type FarewellNote = typeof farewellNotes.$inferSelect;
export type NewFarewellNote = typeof farewellNotes.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

export type Donation = typeof donations.$inferSelect;
export type NewDonation = typeof donations.$inferInsert;
