import { Context } from "hono";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { getProfile, login, register } from "../services/auth.service";
import { setCookie } from "hono/cookie";

// Register Controller
export const registerUser = async (c: Context) => {
  try {
    const { confirmPassword, ...body } = await c.req.json();
    const { user } = await register(body);
    return c.json(
      {
        ok: true,
        message: "Register account successfully",
        data: user,
      },
      201
    );
  } catch (error: Error | any) {
    console.error(error);
    return c.json(
      {
        ok: false,
        message: error.message || "Register failed!",
      },
      400
    );
  }
};

// Login Controller
export const loginUser = async (c: Context) => {
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
      200
    );
  } catch (error: Error | any) {
    return c.json(
      {
        ok: false,
        message: error.message || "Login failed!",
      },
      400
    );
  }
};

// Get Profile Controller
export const getUserProfile = async (c: Context) => {
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
      200
    );
  } catch (error: Error | any) {
    console.info(error);
    return c.json(
      {
        ok: false,
        message: error.message || "Get profile failed!",
      },
      400
    );
  }
};
