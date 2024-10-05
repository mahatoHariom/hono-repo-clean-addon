import { z } from "@hono/zod-openapi";
import { userSchema } from "./user.schema";
import { productSchema } from "./product.schema";

export const cartItemSchema = z.object({
  id: z.string().cuid(), // Prisma uses cuid() for id generation
  productId: z.string(),
  quantity: z.number().min(1).default(1),
  cartId: z.string(),
  createdAt: z.date().default(new Date()), // For now(), representing current date
  updatedAt: z.date(), // @updatedAt will be handled automatically by Prisma
  product: productSchema.omit({ sku: true, description: true }),
});

export const cartSchema = z.object({
  id: z.string().openapi({ example: "cm1ajuml30000356vwniwvrxm" }),
  userId: z.string().openapi({ example: "um1ajuml30000356vwniwvrxm" }),
  createdAt: z.date().optional().openapi({
    description: "Timestamp when the data product was created",
    example: "2023-08-24T12:00:00Z",
  }),
  updatedAt: z.date().optional().openapi({
    description: "Timestamp when the product was last updated",
    example: "2023-08-25T12:00:00Z",
  }),
});
const sortType = ["asc", "desc"] as const;
export const productQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().openapi({ example: 1 }),
  limit: z.coerce.number().min(1).optional().openapi({ example: 10 }),
  // filters: z.string().optional().openapi({ example: '{"name": "ace"}' }),
  q: z.string().optional().openapi({ example: "ace" }),
  // sorts: z.string().optional().openapi({ example: '{"name": "asc"}' }),
  sorts: z.enum(sortType).optional(),
});

export const cartIdSchema = cartSchema.pick({ id: true }).openapi({
  param: {
    required: true,
    in: "path",
  },
});
type cartIdSchema = z.infer<typeof cartIdSchema>;

// export const cartSlugSchema = cartSchema.pick({ slug: true }).openapi({
//   param: {
//     required: true,
//     in: "path",
//   },
// });
// type cartSlugSchema = z.infer<typeof cartSlugSchema>;

export const cartPayloadSchema = z.object({
  productId: z.string().openapi({ example: "cm1sl792000009bg8q1mfg79h" }),
  quantity: z.number().positive().min(1).openapi({ example: 1 }),
});

export const cartIdPayloadSchema = z.string().min(1);
