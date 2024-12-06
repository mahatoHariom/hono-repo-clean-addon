import { OpenAPIHono, z } from "@hono/zod-openapi";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { checkUserToken } from "../middleware/check-user-token";
import { getUserProfile, loginUser, registerUser } from "../controllers/auth.controllers";

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
        description: "Register Failed",
      },
    },
    tags: API_TAGS,
  },
  registerUser
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
  loginUser
);

// Get profile
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
  getUserProfile
);
