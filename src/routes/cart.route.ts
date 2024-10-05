import { OpenAPIHono, z } from "@hono/zod-openapi";
import { Prisma } from "@prisma/client";
import prismaClient from "../libs/prismaClient";

import { checkUserToken } from "../middleware/check-user-token";
import { cartPayloadSchema, cartSchema } from "../schemas/cart.schema";
import { Context } from "hono";
import { getAll } from "../services/cart.services";

const API_TAGS = ["Carts"];
export const cartRoute = new OpenAPIHono();

// // Register security scheme
cartRoute.openAPIRegistry.registerComponent(
  "securitySchemes",
  "AuthorizationBearer",
  {
    type: "http",
    scheme: "bearer",
    in: "header",
    description: "Bearer token",
  },
);
// Get cart data products
cartRoute.openapi(
  {
    method: "get",
    path: "/",
    summary: "Get cart data",
    middleware: checkUserToken,
    security: [
      {
        AuthorizationBearer: [],
      },
    ],
    responses: {
      200: {
        description: "Get cart data",
        content: {
          "application/json": {
            schema: z.object({
              ok: z.boolean().default(true),
              message: z.string(),
              // data: z.array(cartSchema),
            }),
          },
        },
      },
      400: {
        description: "Get cart data Failed",
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
  async (c: Context) => {
    try {
      const user = c.get("user");
      console.info(user, "userData");
      const { carts, totalItem, totalPrice } = await getAll(user.id as string);
      return c.json(
        {
          ok: true,
          message: "Products fetched successfully",
          data: carts,
          totalItem,
          totalPrice,
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

// add product to cart
cartRoute.openapi(
  {
    method: "post",
    path: "/items:id",
    summary: "add Product to slug",
    validator: cartPayloadSchema,
    request: {
      body: {
        content: {
          "application/json": {
            schema: cartPayloadSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Get Product by Slug",
        content: {
          "application/json": {
            schema: z.object({
              ok: z.boolean().default(true),
              message: z.string(),
              // data: cartSchema,
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
    const body = c.req.valid("json");
    try {
      // const { product } = await getBySlug(slug);

      // console.info(product);
      return c.json(
        {
          ok: true,
          message: "Add product successfully",
          // data: product,
        },
        200,
      );
    } catch (error: Error | any) {
      console.info(error.message);
      return c.json(
        {
          ok: false,
          message: error.message || "Add product failed!",
        },
        400,
      );
    }
  },
);

// // Get product by id
// cartRoute.openapi(
//   {
//     method: "get",
//     path: "/{productId}",
//     summary: "Get Product by id",
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
//     try {
//       const { product } = await getById(productId);
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
// // Update product by id
// cartRoute.openapi(
//   {
//     method: "patch",
//     path: "/{productId}",
//     summary: "Update Product by id",
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
// cartRoute.openapi(
//   {
//     method: "delete",
//     path: "/{productId}",
//     summary: "Delete Product by id",
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
