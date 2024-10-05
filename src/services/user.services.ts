import { Product } from "@prisma/client";
import prismaClient from "../libs/prismaClient";
import { productSchema } from "../schemas/product.schema";
import { z } from "@hono/zod-openapi";

type SortType = "asc" | "desc";

export const getAll = async (
  page: number,
  limit: number,
  q: string,
  sort: string,
) => {
  const skip = page > 0 ? (page - 1) * limit : 0;
  const sortFormated = sort as SortType;

  try {
    const [users, total] = await Promise.all([
      prismaClient.user.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          name: {
            contains: q,
            mode: "insensitive",
          },
        },
        skip,
        take: limit,
        orderBy: {
          name: sortFormated,
        },
      }),
      prismaClient.product.count({
        where: {
          name: {
            contains: q,
          },
        },
      }),
    ]);

    if (users.length === 0) {
      throw new Error("Users not found!");
    }

    const paginationData = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    };
    return {
      users,
      pagination: paginationData,
    };
  } catch (error) {
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
};

export const getById = async (id: string) => {
  try {
    const user = await prismaClient.user.findUniqueOrThrow({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found!");
    }

    return {
      user,
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
