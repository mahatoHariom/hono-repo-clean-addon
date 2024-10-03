import { OpenAPIHono, z } from "@hono/zod-openapi";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { login, register } from "../services/auth.service";
import { setCookie } from "hono/cookie";
const API_TAGS = ["Auth"];
export const authRoute = new OpenAPIHono();

// Register user
authRoute.openapi(
  {
    method: "post",
    path: "/register",
    summary: "Register user",
    request: {
      body: {
        content: {
          "application/json": {
            schema: registerSchema,
          },
        },
      },
    },

    responses: {
      201: {
        description: "Register successfully",
        content: {
          "application/json": {
            schema: z.object({
              ok: z.boolean().default(true),
              message: z.string(),
              data: z
                .object({
                  id: z.string(),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                })
                .extend({
                  registerSchema,
                }),
            }),
          },
        },
      },
      400: {
        description: "Login Failed",
      },
    },
    tags: API_TAGS,
  },
  async (c) => {
    try {
      const body = await c.req.json();
      const { user } = await register(body);
      return c.json(
        {
          ok: true,
          message: "Register successfully",
          data: user,
        },
        201,
      );
    } catch (error: Error | any) {
      return c.json(
        {
          ok: false,
          message: error.message || "Register failed!",
        },
        400,
      );
    }
  },
);
// Login user
authRoute.openapi(
  {
    method: "post",
    path: "/login",
    summary: "Log in user",
    request: {
      body: {
        content: {
          "application/json": {
            schema: loginSchema,
          },
        },
      },
    },

    responses: {
      200: {
        description: "Login successfully",
      },
      400: {
        description: "Login Failed",
      },
    },
    tags: API_TAGS,
  },
  async (c) => {
    try {
      const body = await c.req.json();
      const { token, user } = await login(body);
      c.header("Authorization", `${token}`);
      setCookie(c, "token", token);
      return c.json(
        {
          ok: true,
          message: "Login successfully",
          data: user,
        },
        200,
      );
    } catch (error: Error | any) {
      return c.json(
        {
          ok: false,
          message: error.message || "Login failed!",
        },
        400,
      );
    }
  },
);

// get profile
authRoute.openapi(
  {
    method: "get",
    path: "/me",
    summary: "Get profile user",
    request: {
      body: {
        content: {
          "application/json": {
            schema: loginSchema,
          },
        },
      },
    },

    responses: {
      200: {
        description: "Get profile successfully",
      },
      400: {
        description: "Get profile Failed",
      },
    },
    tags: API_TAGS,
  },
  async (c) => {
    try {
      const header = await c.req.json();
      //   const { token, user } = await login(header);
      //   c.header("Authorization", `${token}`);
      //   setCookie(c, "token", token);
      return c.json(
        {
          ok: true,
          message: "Login successfully",
        },
        200,
      );
    } catch (error: Error | any) {
      return c.json(
        {
          ok: false,
          message: error.message || "Login failed!",
        },
        400,
      );
    }
  },
);

// get profile
authRoute.openapi(
  {
    method: "get",
    path: "/logout",
    summary: "Log out user",
    security: [{ AuthorizationBearer: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: loginSchema,
          },
        },
      },
    },

    responses: {
      200: {
        description: "Log out  successfully",
      },
      400: {
        description: "Log out  Failed",
      },
    },
    tags: API_TAGS,
  },
  async (c) => {
    try {
      const header = await c.req.json();
      //   const { token, user } = await login(header);
      //   c.header("Authorization", `${token}`);
      //   setCookie(c, "token", token);
      return c.json(
        {
          ok: true,
          message: "Login successfully",
        },
        200,
      );
    } catch (error: Error | any) {
      return c.json(
        {
          ok: false,
          message: error.message || "Login failed!",
        },
        400,
      );
    }
  },
);
