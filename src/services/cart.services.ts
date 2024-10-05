import { Product } from "@prisma/client";
import prismaClient from "../libs/prismaClient";
import { productSchema } from "../schemas/product.schema";
import { z } from "@hono/zod-openapi";

type SortType = "asc" | "desc";

export const getAll = async (id: string) => {
  try {
    const carts = await prismaClient.cart.findFirst({
      where: {
        userId: id,
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        items: {
          include: {
            product: {
              omit: {
                description: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    if (!carts) {
      const newCart = await prismaClient.cart.create({
        data: {
          userId: id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return {
        carts: newCart,
        totalItem: 0,
        totalPrice: 0,
      };
    }
    const totalItem = carts.items.length;
    const totalPrice = carts.items.reduce((acc, item) => {
      return acc + item.quantity + item.product.price;
    }, 0);
    return {
      carts,
      totalItem,
      totalPrice,
    };
  } catch (error) {
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
};

// export const getBySlug = async (slug: string) => {
//   try {
//     const product = await prismaClient.product.findUniqueOrThrow({
//       where: { slug },
//     });

//     if (!product) {
//       throw new Error("Product not found!");
//     }

//     return {
//       product,
//     };
//   } catch (error) {
//     throw error;
//   } finally {
//     await prismaClient.$disconnect();
//   }
// };
// export const getById = async (id: string) => {
//   try {
//     const product = await prismaClient.product.findUniqueOrThrow({
//       where: { id },
//     });

//     if (!product) {
//       throw new Error("Product not found!");
//     }

//     return {
//       product,
//     };
//   } catch (error) {
//     throw error;
//   } finally {
//     await prismaClient.$disconnect();
//   }
// };

// export const updateById = async (id: string, data: Product) => {
//   const isExist = await getById(id);
//   if (!isExist) {
//     throw new Error("Product not found!");
//   }

//   try {
//     const updateProduct = await prismaClient.product.update({
//       where: {
//         id: id,
//       },
//       data: data,
//     });
//     if (!updateProduct) {
//       throw new Error("Product not found!");
//     }

//     return {
//       product: updateProduct,
//     };
//   } catch (error: Error | any) {
//     return error;
//   } finally {
//     await prismaClient.$disconnect();
//   }
// };
// export const deleteById = async (id: string) => {
//   const isExist = await getById(id);
//   if (!isExist) {
//     throw new Error("Product not found!");
//   }
//   return await prismaClient.product.delete({ where: { id } });
// };
