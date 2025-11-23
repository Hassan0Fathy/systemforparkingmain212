import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("customer"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const cars = pgTable("cars", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  plateNumber: text("plate_number").notNull().unique(),
  ownerName: text("owner_name").notNull(),
  qrValue: text("qr_value").notNull().unique(),
  qrCode: text("qr_code").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const visits = pgTable("visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  carId: varchar("car_id").notNull(),
  plateNumber: text("plate_number").notNull(),
  ownerName: text("owner_name").notNull(),
  checkInTime: timestamp("check_in_time").notNull(),
  checkOutTime: timestamp("check_out_time"),
  duration: integer("duration"),
  fee: integer("fee"),
  isCheckedIn: boolean("is_checked_in").notNull().default(true),
});

export const insertCarSchema = createInsertSchema(cars).pick({
  plateNumber: true,
  ownerName: true,
});

export const insertVisitSchema = createInsertSchema(visits).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof cars.$inferSelect;
export type InsertVisit = z.infer<typeof insertVisitSchema>;
export type Visit = typeof visits.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
