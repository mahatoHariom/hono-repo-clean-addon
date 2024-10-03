import { Product } from "@prisma/client";
import prismaClient from "../libs/prismaClient";
import { productSchema } from "../schemas/product.schema";
import { z } from "@hono/zod-openapi";

type SortType = "asc" | "desc";

export const getAll = async (id: string) => {
  try {
    const [carts, total] = await Promise.all([
      prismaClient.cart.findMany({
        where: {
          id,
        },
      }),
      prismaClient.cart.count({
        where: {
          id,
        },
      }),
    ]);

    if (carts.length === 0) {
      throw new Error("Products not found!");
    }

    return {
      carts,
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
