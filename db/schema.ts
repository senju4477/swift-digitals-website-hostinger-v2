import { sql } from "drizzle-orm";
import { datetime, index, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const enquiries = mysqlTable("enquiries", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull().default(""),
  website: varchar("website", { length: 500 }).notNull().default(""),
  service: varchar("service", { length: 64 }).notNull(),
  message: text("message").notNull(),
  createdAt: datetime("created_at", { mode: "string", fsp: 6 })
    .notNull().default(sql`CURRENT_TIMESTAMP(6)`),
}, (table) => [index("idx_enquiries_email_created").on(table.email, table.createdAt)]);

// A persistent row lock serializes count-and-insert for an email across processes.
export const enquiryEmailLocks = mysqlTable("enquiry_email_locks", {
  email: varchar("email", { length: 254 }).primaryKey(),
});

export type Enquiry = typeof enquiries.$inferSelect;
export type NewEnquiry = typeof enquiries.$inferInsert;
