import { z } from "@hono/zod-openapi";

export const cartSchema = z.object({
  id: z.string().openapi({ example: "cm1ajuml30000356vwniwvrxm" }),
  userId: z.string().openapi({ example: "um1ajuml30000356vwniwvrxm" }),
  user: z.string().openapi({
    example: "Favourite necklace of Portgas D. Ace",
  }),
  items: z.string().openapi({
    example: "Favourite necklace of Portgas D. Ace",
  }),

  createdAt: z.date().optional().openapi({
    description: "Timestamp when the data product was created",
    example: "2023-08-24T12:00:00Z",
  }),
  updatedAt: z.date().optional().openapi({
    description: "Timestamp when the product was last updated",
    example: "2023-08-25T12:00:00Z",
  }),
});
// const sortType = ["asc", "desc"] as const;
// export const productQuerySchema = z.object({
//   page: z.coerce.number().min(1).optional().openapi({ example: 1 }),
//   limit: z.coerce.number().min(1).optional().openapi({ example: 10 }),
//   // filters: z.string().optional().openapi({ example: '{"name": "ace"}' }),
//   q: z.string().optional().openapi({ example: "ace" }),
//   // sorts: z.string().optional().openapi({ example: '{"name": "asc"}' }),
//   sorts: z.enum(sortType).optional(),
// });

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

export const cartPayloadSchema = cartSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
