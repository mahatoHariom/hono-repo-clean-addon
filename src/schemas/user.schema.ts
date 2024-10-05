import { z } from "@hono/zod-openapi";
export const userSchema = z.object({
  id: z.string().cuid(), // cuid() for id generation
  name: z.string().max(100), // Name with a maximum of 100 characters
  email: z.string().email(), // Unique email with email format validation
  phone: z.string().max(32).optional(), // Optional phone with max length 32
  address: z.string().max(255).optional(), // Optional address with max length 255
  createdAt: z.date().default(new Date()), // Default to current date
  updatedAt: z.date(), // Automatically handled by Prisma
});
