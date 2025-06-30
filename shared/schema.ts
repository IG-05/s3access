import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  cognitoId: text("cognito_id").notNull().unique(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(), // 'user' or 'admin'
  cognitoGroups: text("cognito_groups").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const s3Buckets = pgTable("s3_buckets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  region: text("region").notNull(),
  arn: text("arn").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bucketPermissions = pgTable("bucket_permissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  bucketId: integer("bucket_id").references(() => s3Buckets.id),
  accessLevel: text("access_level").notNull(), // 'read', 'write', 'admin'
  createdAt: timestamp("created_at").defaultNow(),
});

export const accessRequests = pgTable("access_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  bucketId: integer("bucket_id").references(() => s3Buckets.id),
  requestedDuration: integer("requested_duration").notNull(), // in hours
  justification: text("justification").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'denied'
  approvedBy: integer("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  cognitoId: true,
  username: true,
  email: true,
  role: true,
  cognitoGroups: true,
});

export const insertBucketSchema = createInsertSchema(s3Buckets).pick({
  name: true,
  region: true,
  arn: true,
});

export const insertBucketPermissionSchema = createInsertSchema(bucketPermissions).pick({
  userId: true,
  bucketId: true,
  accessLevel: true,
});

export const insertAccessRequestSchema = createInsertSchema(accessRequests).pick({
  userId: true,
  bucketId: true,
  requestedDuration: true,
  justification: true,
});

export const updateAccessRequestSchema = createInsertSchema(accessRequests).pick({
  status: true,
  approvedBy: true,
  approvedAt: true,
  expiresAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type S3Bucket = typeof s3Buckets.$inferSelect;
export type InsertS3Bucket = z.infer<typeof insertBucketSchema>;
export type BucketPermission = typeof bucketPermissions.$inferSelect;
export type InsertBucketPermission = z.infer<typeof insertBucketPermissionSchema>;
export type AccessRequest = typeof accessRequests.$inferSelect;
export type InsertAccessRequest = z.infer<typeof insertAccessRequestSchema>;
export type UpdateAccessRequest = z.infer<typeof updateAccessRequestSchema>;
