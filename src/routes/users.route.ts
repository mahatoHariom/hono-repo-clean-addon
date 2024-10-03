import { OpenAPIHono, z } from "@hono/zod-openapi";
import { Prisma } from "@prisma/client";
import prismaClient from "../libs/prismaClient";
import {
  productPayloadSchema,
  productQuerySchema,
  productSchema,
  productSlugSchema,
} from "../schemas/product.schema";

import { registerSchema, usersQuerySchema } from "../schemas/auth.schema";
import { getAll, getById } from "../services/user.services";

const API_TAGS = ["Users"];
export const userRoute = new OpenAPIHono();

// Get All users
userRoute.openapi(
  {
    method: "get",
    path: "/",
    summary: "Get Users",
    request: {
      query: usersQuerySchema,
    },
    responses: {
      200: {
        description: "Get Users",
        content: {
          "application/json": {
            schema: z.object({
              ok: z.boolean().default(true),
              message: z.string(),
              data: z.array(
                z.object({
                  id: z.string(),
                  name: z.string().optional().nullable(),
                }),
              ),
            }),
          },
        },
      },
      400: {
        description: "Get Users Failed",
        content: {
          "application/json": {
            schema: z.object({
              ok: z.boolean().default(false),
              message: z.string(),
            }),
          },
        },
      },
    },
    tags: API_TAGS,
  },
  async (c) => {
    const { page = 1, limit = 10, q, sorts = "asc" } = c.req.query();

    try {
      const { users, pagination } = await getAll(
        Number(page),
        Number(limit),
        q,
        sorts,
      );
      return c.json(
        {
          ok: true,
          message: "Users fetched successfully",
          data: users,
          pagination,
        },
        200,
      );
    } catch (error: Error | any) {
      return c.json(
        {
          ok: false,
          message: error.message || "Products not found!",
        },
        400,
      );
    }
  },
);

// Get user by id
userRoute.openapi(
  {
    method: "get",
    path: "/{userId}",
    summary: "Get User by id (for admin dashboard)",
    request: {
      params: z.object({
        userId: z.string(),
      }),
    },
    responses: {
      200: {
        description: "Get Product by Slug",
        content: {
          "application/json": {
            schema: z.object({
              ok: z.boolean().default(true),
              message: z.string(),
              data: z.object({
                id: z.string(),
                name: z.string().optional(),
                createdAt: z.date().optional().openapi({
                  description: "Timestamp when the data product was created",
                  example: "2023-08-24T12:00:00Z",
                }),
                updatedAt: z.date().optional().openapi({
                  description: "Timestamp when the product was last updated",
                  example: "2023-08-25T12:00:00Z",
                }),
              }),
            }),
          },
        },
      },
      400: {
        description: "Get Product by Slug Failed",
        content: {
          "application/json": {
            schema: z.object({
              ok: z.boolean().default(false),
              message: z.string(),
            }),
          },
        },
      },
    },
    tags: API_TAGS,
  },
  async (c) => {
    const { userId } = c.req.valid("param");
    try {
      const { user } = await getById(userId);
      return c.json(
        {
          ok: true,
          message: "Products fetched successfully",
          data: user,
        },
        200,
      );
    } catch (error: Error | any) {
      console.info(error.message);
      return c.json(
        {
          ok: false,
          message: error.message || "Product not found!",
        },
        400,
      );
    }
  },
);
// // Update product by id
// userRoute.openapi(
//   {
//     method: "patch",
//     path: "/{productId}",
//     summary: "Update Product by id (for admin dashboard)",
//     request: {
//       params: z.object({
//         productId: z.string(),
//       }),
//       body: {
//         content: {
//           "application/json": {
//             schema: productPayloadSchema,
//           },
//         },
//       },
//     },
//     responses: {
//       200: {
//         description: "Get Product by Slug",
//         content: {
//           "application/json": {
//             schema: z.object({
//               ok: z.boolean().default(true),
//               message: z.string(),
//               data: productSchema,
//             }),
//           },
//         },
//       },
//       400: {
//         description: "Get Product by Slug Failed",
//         content: {
//           "application/json": {
//             schema: z.object({
//               ok: z.boolean().default(false),
//               message: z.string(),
//             }),
//           },
//         },
//       },
//     },
//     tags: API_TAGS,
//   },
//   async (c) => {
//     const { productId } = c.req.valid("param");
//     const body = await c.req.json();
//     try {
//       const { product } = await updateById(productId, body);

//       console.info(product);
//       return c.json(
//         {
//           ok: true,
//           message: "Products fetched successfully",
//           data: product,
//         },
//         200,
//       );
//     } catch (error: Error | any) {
//       console.info(error.message);
//       return c.json(
//         {
//           ok: false,
//           message: error.message || "Product not found!",
//         },
//         400,
//       );
//     }
//   },
// );

// // Delete product by id
// userRoute.openapi(
//   {
//     method: "delete",
//     path: "/{productId}",
//     summary: "Delete Product by id (for admin dashboard)",
//     request: {
//       params: z.object({
//         productId: z.string(),
//       }),
//     },
//     responses: {
//       200: {
//         description: "Get Product by Slug",
//         content: {
//           "application/json": {
//             schema: z.object({
//               ok: z.boolean().default(true),
//               message: z.string(),
//             }),
//           },
//         },
//       },
//       400: {
//         description: "Get Product by Slug Failed",
//         content: {
//           "application/json": {
//             schema: z.object({
//               ok: z.boolean().default(false),
//               message: z.string(),
//             }),
//           },
//         },
//       },
//     },
//     tags: API_TAGS,
//   },
//   async (c) => {
//     const { productId } = c.req.valid("param");
//     try {
//       const deletedProduct = await deleteById(productId);

//       console.info(deletedProduct);
//       return c.json(
//         {
//           ok: true,
//           message: `Product: ${deletedProduct.name}  successfully deleted`,
//         },
//         200,
//       );
//     } catch (error: Error | any) {
//       console.info(error.message);
//       return c.json(
//         {
//           ok: false,
//           message: error.message || "Product not found!",
//         },
//         400,
//       );
//     }
//   },
// );
