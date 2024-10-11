import { OpenAPIHono, z } from "@hono/zod-openapi";
import { checkUserToken } from "../middleware/check-user-token";
import { Context } from "hono";
import {
  getOrderByorderId,
  getOrders,
  payment,
} from "../services/cart.services";
import { cartItemSchema } from "../schemas/cart.schema";
const API_TAGS = ["Orders"];
export const orderRoute = new OpenAPIHono();

// Register security scheme
orderRoute.openAPIRegistry.registerComponent(
  "securitySchemes",
  "AuthorizationBearer",
  {
    type: "http",
    scheme: "bearer",
    in: "header",
    description: "Bearer token",
  },
);
// get orders data
orderRoute.openapi(
  {
    method: "get",
    path: "/",
    middleware: checkUserToken,
    security: [
      {
        AuthorizationBearer: [],
      },
    ],
    summary: "Get orders data",
    responses: {
      200: {
        description: "Get orders data",
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
        description: "Get orders data Failed",
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
    try {
      const order = await getOrders(user.id as string);

      return c.json(
        {
          ok: true,
          message: "Get orders data successfully",
          data: order,
        },
        200,
      );
    } catch (error: Error | any) {
      console.info(error.message);
      return c.json(
        {
          ok: false,
          message: error.message || "Get orders data failed!",
        },
        400,
      );
    }
  },
);
// get order data by id
orderRoute.openapi(
  {
    method: "get",
    path: "/{orderId}",
    middleware: checkUserToken,
    security: [
      {
        AuthorizationBearer: [],
      },
    ],
    summary: "Get order detail",
    request: {
      params: z.object({
        orderId: z.string(),
      }),
    },
    responses: {
      200: {
        description: "Get order detail",
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
        description: "Get order detail Failed",
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
    const { orderId } = c.req.param();

    try {
      const order = await getOrderByorderId(orderId);

      return c.json(
        {
          ok: true,
          message: "Get order detail successfully",
          data: order,
        },
        200,
      );
    } catch (error: Error | any) {
      console.info(error.message);
      return c.json(
        {
          ok: false,
          message: error.message || "Get order detail failed!",
        },
        400,
      );
    }
  },
);

// // buy item
// orderRoute.openapi(
//   {
//     method: "post",
//     path: "/buy/{orderId}",
//     middleware: checkUserToken,
//     security: [
//       {
//         AuthorizationBearer: [],
//       },
//     ],
//     summary: "Checkout Product from cart",
//     validator: z.array(cartItemSchema.pick({ id: true })),
//     request: {
//       params: z.object({
//         orderId: z.string(),
//       }),
//     },
//     responses: {
//       200: {
//         description: "Add Product to cart",
//         content: {
//           "application/json": {
//             schema: z.object({
//               ok: z.boolean().default(true),
//               message: z.string(),
//               // data: cartSchema,
//             }),
//           },
//         },
//       },
//       400: {
//         description: "Add Product to cart Failed",
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
//   async (c: Context) => {
//     const id = c.req.param("orderId");
//     // const user = c.get("user");
//     try {
//       const order = await buyItemFromOrder(id);

//       return c.json(
//         {
//           ok: true,
//           message: "Order created successfully",
//           data: order,
//         },
//         200,
//       );
//     } catch (error: Error | any) {
//       console.info(error.message);
//       return c.json(
//         {
//           ok: false,
//           message: error.message || "Order created failed!",
//         },
//         400,
//       );
//     }
//   },
// );
// Buy product
orderRoute.openapi(
  {
    method: "post",
    path: "/payment/{cartId}",
    middleware: checkUserToken,
    security: [
      {
        AuthorizationBearer: [],
      },
    ],
    summary: "Buy Product (Payment) ",
    validator: z.array(cartItemSchema.pick({ id: true })),
    request: {
      params: z.object({
        cartId: z.string(),
      }),
    },
    responses: {
      200: {
        description: "Buy Product and order created successfully",
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
        description: "Buy Product and order created Failed",
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
    const cartId = c.req.param("cartId");
    const user = c.get("user");
    try {
      const order = await payment(user.id, cartId);

      return c.json(
        {
          ok: true,
          message: "Buy Product and order created successfully",
          data: order,
        },
        200,
      );
    } catch (error: Error | any) {
      console.info(error.message);
      return c.json(
        {
          ok: false,
          message: error.message || "Buy Product and order created failed!",
        },
        400,
      );
    }
  },
);
