import { Product } from "@prisma/client";
import prismaClient from "../libs/prismaClient";
import { productSchema } from "../schemas/product.schema";
import { z } from "@hono/zod-openapi";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { hashPassword, verifyPassword } from "../libs/password";
import { createToken } from "../libs/token";

type SortType = "asc" | "desc";

export const register = async (payload: z.infer<typeof registerSchema>) => {
  try {
    const user = await prismaClient.user.create({
      data: {
        ...payload,
        password: {
          create: {
            hash: await hashPassword(payload.password),
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // create cart if user successfully registered
    if (user) {
      await prismaClient.cart.create({
        data: {
          userId: user.id,
          allSelected: false,
        },
      });
    }
    return { user };
  } catch (error) {
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
};
export const login = async (payload: z.infer<typeof loginSchema>) => {
  try {
    const user = await prismaClient.user.findUnique({
      where: { email: payload.email },
      include: { password: { select: { hash: true } } },
    });

    if (!user) {
    }

    if (!user?.password?.hash) {
      throw new Error("Cannot login because user doesn't have a password");
    }
    const validPassword = await verifyPassword(
      user.password.hash,
      payload.password,
    );

    if (!validPassword) {
      throw new Error("Password incorrect");
    }

    const token = await createToken(user.id);

    if (!token) {
      throw new Error("Authentication failed to process");
    }

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
      },
    };
  } catch (error) {
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
};

export const getProfile = async (userId: string) => {
  console.info(userId);
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      throw new Error("User not found!");
    }

    return {
      user,
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
};
