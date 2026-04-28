import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const machines = pgTable(
  "machines",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: text("name").notNull().default(""),
    brand: text("brand").notNull().default(""),
    model: text("model").notNull().default(""),
    year: integer("year").notNull().default(2020),
    price: integer("price").notNull().default(0),
    costPrice: integer("cost_price").notNull().default(0),
    currency: text("currency").notNull().default("TWD"),
    location: text("location").notNull().default(""),
    category: text("category").notNull().default(""),
    description: text("description").notNull().default(""),
    hoursUsed: integer("hours_used").notNull().default(0),
    controller: text("controller").notNull().default(""),
    pumpSystem: text("pump_system").notNull().default(""),
    isOfficial: boolean("is_official").notNull().default(false),
    inspectionScore: integer("inspection_score").notNull().default(0),
    thumbnail: text("thumbnail").notNull().default(""),
    gallery: text("gallery").array().notNull().default(sql`'{}'::text[]`),
    tradingStatus: text("trading_status").notNull().default("待售"),
    specs: jsonb("specs").$type<Record<string, string>>().notNull().default(sql`'{}'::jsonb`),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("machines_created_at_idx").on(table.createdAt.desc()),
    index("machines_category_active_idx").on(table.category, table.isActive),
  ],
);

export const inquiries = pgTable(
  "inquiries",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: text("name").notNull().default(""),
    phone: text("phone").notNull().default(""),
    email: text("email").notNull().default(""),
    product: text("product").notNull().default(""),
    equipmentId: text("equipment_id").notNull().default(""),
    message: text("message").notNull().default(""),
    status: text("status").notNull().default("待回覆"),
    adminNote: text("admin_note").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("inquiries_status_created_idx").on(table.status, table.createdAt.desc()),
  ],
);

export const sellerRequests = pgTable(
  "seller_requests",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: text("name").notNull().default(""),
    phone: text("phone").notNull().default(""),
    email: text("email").notNull().default(""),
    machineBrand: text("machine_brand").notNull().default(""),
    machineModel: text("machine_model").notNull().default(""),
    machineYear: text("machine_year").notNull().default(""),
    machineHours: text("machine_hours").notNull().default(""),
    machinePrice: text("machine_price").notNull().default(""),
    machineLocation: text("machine_location").notNull().default(""),
    machineCondition: text("machine_condition").notNull().default(""),
    status: text("status").notNull().default("待聯繫"),
    adminNote: text("admin_note").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("seller_requests_status_created_idx").on(table.status, table.createdAt.desc()),
  ],
);

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
