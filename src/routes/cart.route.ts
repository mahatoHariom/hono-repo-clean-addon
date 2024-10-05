import { OpenAPIHono, z } from "@hono/zod-openapi";

import { checkUserToken } from "../middleware/check-user-token";
import {
  cartIdPayloadSchema,
  cartItemSchema,
  cartPayloadSchema,
  cartSchema,
} from "../schemas/cart.schema";
import { Context } from "hono";
import {
  addItems,
  checkout,
  deleteItemsFromCartById,
  getCart,
  updateById,
} from "../services/cart.services";

const API_TAGS = ["Carts"];
export const cartRoute = new OpenAPIHono();

// Register security scheme
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
              data: cartSchema,
              totalItem: z.number(),
              totalPrice: z.number(),
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
      const { carts, totalItem, totalPrice } = await getCart(user.id as string);
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
    path: "/items",
    middleware: checkUserToken,
    security: [
      {
        AuthorizationBearer: [],
      },
    ],
    summary: "Add Product to cart",
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
        description: "Add Product to cart",
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
        description: "Add Product to cart Failed",
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
    const body = await c.req.json();
    const user = c.get("user");
    try {
      const cart = await addItems(body, user.id);

      // console.info(product);
      return c.json(
        {
          ok: true,
          message: "Add product successfully",
          data: cart,
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

// Update product by id
cartRoute.openapi(
  {
    method: "patch",
    path: "/items/{id}",
    middleware: checkUserToken,
    security: [
      {
        AuthorizationBearer: [],
      },
    ],
    summary: "Update Product by id",
    request: {
      params: z.object({
        id: z.string(),
      }),
      body: {
        content: {
          "application/json": {
            schema: cartPayloadSchema.omit({ productId: true }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Update Product by id",
        content: {
          "application/json": {
            schema: z.object({
              ok: z.boolean().default(true),
              message: z.string(),
              data: cartSchema,
            }),
          },
        },
      },
      400: {
        description: "Update Product by id Failed",
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
    const { id: itemId } = c.req.valid("param");
    const body = await c.req.json();
    try {
      const { product } = await updateById(itemId, body.quantity);

      console.info(product);
      return c.json(
        {
          ok: true,
          message: "Product updated successfully",
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

// Delete cart by id
cartRoute.openapi(
  {
    method: "delete",
    path: "/items/{id}",
    middleware: checkUserToken,
    security: [
      {
        AuthorizationBearer: [],
      },
    ],
    summary: "Delete Product from cart by id",
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        description: "Delete Product from cart by id",
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
        description: "Delete Product from cart by id Failed",
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
    const user = c.get("user");
    const itemId = c.req.param("id");
    console.info(itemId, "items");
    try {
      const deletedProduct = await deleteItemsFromCartById(
        itemId,
        user.id as string,
      );

      console.info(deletedProduct);
      return c.json(
        {
          ok: true,
          message: `Product: ${deletedProduct.product.name} successfully deleted`,
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

// Checkout product from cart
cartRoute.openapi(
  {
    method: "post",
    path: "/checkout",
    middleware: checkUserToken,
    security: [
      {
        AuthorizationBearer: [],
      },
    ],
    summary: "Checkout Product from cart",
    validator: z.array(cartItemSchema.pick({ id: true })),
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.array(cartIdPayloadSchema),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Add Product to cart",
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
        description: "Add Product to cart Failed",
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
    const body = await c.req.json();
    const user = c.get("user");
    try {
      const order = await checkout(body, user.id);

      return c.json(
        {
          ok: true,
          message: "Order created successfully",
          data: order,
        },
        200,
      );
    } catch (error: Error | any) {
      console.info(error.message);
      return c.json(
        {
          ok: false,
          message: error.message || "Order created failed!",
        },
        400,
      );
    }
  },
);
