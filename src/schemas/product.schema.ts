import { z } from "@hono/zod-openapi";

export const productSchema = z.object({
  id: z.string().openapi({ example: "cm1ajuml30000356vwniwvrxm" }),
  name: z.string().min(5).max(100).openapi({ example: "Ace Necklace" }),
  slug: z.string().min(5).max(100).openapi({ example: "ace-necklace" }),
  description: z
    .string()
    .max(500)
    .openapi({ example: "Favourite necklace of Portgas D. Ace" }),
  category: z.string().openapi({ example: "necklace" }),
  price: z.coerce.number().min(1).openapi({ example: 10000 }),
  stock: z.coerce.number().min(1).openapi({ example: 10 }),
  sku: z.string().optional().openapi({ example: "NA001" }),
  imageURL: z
    .string()
    .url()
    .or(z.null())
    .openapi({ example: "https://placehold.co/500x500?text=No%20Image" }),
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

export const productIdSchema = productSchema.pick({ id: true }).openapi({
  param: {
    required: true,
    in: "path",
  },
});
type productIdSchema = z.infer<typeof productIdSchema>;

export const productSlugSchema = productSchema.pick({ slug: true }).openapi({
  param: {
    required: true,
    in: "path",
  },
});
type productSlugSchema = z.infer<typeof productSlugSchema>;

export const productPayloadSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
