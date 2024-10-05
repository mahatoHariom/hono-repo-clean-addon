import { OpenAPIHono, z } from "@hono/zod-openapi";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { getProfile, login, register } from "../services/auth.service";
import { setCookie } from "hono/cookie";
import { checkUserToken } from "../middleware/check-user-token";
import { Context } from "hono";
const API_TAGS = ["Auth"];
export const authRoute = new OpenAPIHono();

authRoute.openAPIRegistry.registerComponent(
  "securitySchemes",
  "AuthorizationBearer",
  {
    type: "http",
    scheme: "bearer",
    in: "header",
    description: "Bearer token",
  },
);
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
      const { confirmPassword, ...body } = await c.req.json();
      const { user } = await register(body);
      return c.json(
        {
          ok: true,
          message: "Register account successfully",
          data: user,
        },
        201,
      );
    } catch (error: Error | any) {
      console.error(error);
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
          token,
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
    middleware: checkUserToken,
    security: [{ AuthorizationBearer: [] }],
    summary: "Get profile user",
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
  async (c: Context) => {
    try {
      const user = c.get("user");
      console.info(user, "userData");
      const { user: userData } = await getProfile(user.id as string);

      return c.json(
        {
          ok: true,
          message: "Get profile successfully",
          data: userData,
        },
        200,
      );
    } catch (error: Error | any) {
      console.info(error);
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
