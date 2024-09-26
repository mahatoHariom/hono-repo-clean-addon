import { OpenAPIHono, z } from "@hono/zod-openapi";
import { Prisma } from "@prisma/client";
import prismaClient from "../libs/prismaClient";
import {
  productPayloadSchema,
  productQuerySchema,
  productSchema,
  productSlugSchema,
} from "../schemas/product.schema";
import {
  deleteById,
  getAll,
  getById,
  getBySlug,
  updateById,
} from "../services/product.services";

const API_TAGS = ["Products"];
export const productRoute = new OpenAPIHono();

// Get All products
productRoute.openapi(
  {
    method: "get",
    path: "/",
    summary: "Get Products",
    request: {
      query: productQuerySchema,
    },
    responses: {
      200: {
        description: "Get Products",
        content: {
          "application/json": {
            schema: z.object({
              ok: z.boolean().default(true),
              message: z.string(),
              data: z.array(productSchema),
            }),
          },
        },
      },
      400: {
        description: "Get Products Failed",
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
    try {
      const { page = 1, limit = 10, q, sorts = "asc" } = c.req.query();

      const { products, pagination } = await getAll(
        Number(page),
        Number(limit),
        q,
        sorts,
      );
      return c.json(
        {
          ok: true,
          message: "Products fetched successfully",
          data: products,
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

// Get product by slug
productRoute.openapi(
  {
    method: "get",
    path: "/{slug}",
    summary: "Get Product by Slug",
    request: {
      params: productSlugSchema,
    },
    responses: {
      200: {
        description: "Get Product by Slug",
        content: {
          "application/json": {
            schema: z.object({
              ok: z.boolean().default(true),
              message: z.string(),
              data: productSchema,
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
    const { slug } = c.req.valid("param");
    try {
      const { product } = await getBySlug(slug);

      console.info(product);
      return c.json(
        {
          ok: true,
          message: "Products fetched successfully",
          data: product,
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

// // Get product by id
// productRoute.openapi(
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
// Update product by id
productRoute.openapi(
  {
    method: "patch",
    path: "/{productId}",
    summary: "Update Product by id",
    request: {
      params: z.object({
        productId: z.string(),
      }),
      body: {
        content: {
          "application/json": {
            schema: productPayloadSchema,
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
              data: productSchema,
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
    const { productId } = c.req.valid("param");
    const body = await c.req.json();
    try {
      const { product } = await updateById(productId, body);

      console.info(product);
      return c.json(
        {
          ok: true,
          message: "Products fetched successfully",
          data: product,
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

// Delete product by id
productRoute.openapi(
  {
    method: "delete",
    path: "/{productId}",
    summary: "Delete Product by id",
    request: {
      params: z.object({
        productId: z.string(),
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
    const { productId } = c.req.valid("param");
    try {
      const deletedProduct = await deleteById(productId);

      console.info(deletedProduct);
      return c.json(
        {
          ok: true,
          message: `Product: ${deletedProduct.name}  successfully deleted`,
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
