import { z } from "@hono/zod-openapi";

export const loginSchema = z.object({
  email: z.string().email().min(5).openapi({
    description: "The email of the user.",
    example: "monkeydluffy@gmail.com",
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255, "Password must not exceed 255 characters")
    .openapi({
      description: "The password of the user.",
      example: "Password123!",
    }),
});

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(4).max(100).openapi({ example: "ace" }),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(255, "Password must not exceed 255 characters")
      .openapi({
        description: "The password of the user.",
        example: "Password123!",
      }),
    address: z.string().max(255).optional().openapi({
      description: "Address of the user.",
      example: "Sabaody Archipelago",
    }),
    phone: z.string().min(1).max(32).optional().openapi({
      description: "Phone number of the user.",
      example: "08132456789",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const sortType = ["asc", "desc"] as const;
export const usersQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().openapi({ example: 1 }),
  limit: z.coerce.number().min(1).optional().openapi({ example: 10 }),
  // filters: z.string().optional().openapi({ example: '{"name": "ace"}' }),
  q: z.string().optional().openapi({ example: "ace" }),
  // sorts: z.string().optional().openapi({ example: '{"name": "asc"}' }),
  sorts: z.enum(sortType).optional(),
});

// export const productIdSchema = productSchema.pick({ id: true }).openapi({
//   param: {
//     required: true,
//     in: "path",
//   },
// });
// type productIdSchema = z.infer<typeof productIdSchema>;

// export const productSlugSchema = productSchema.pick({ slug: true }).openapi({
//   param: {
//     required: true,
//     in: "path",
//   },
// });
// type productSlugSchema = z.infer<typeof productSlugSchema>;

// export const productPayloadSchema = productSchema.omit({
//   id: true,
//   createdAt: true,
//   updatedAt: true,
// });
