import { Product } from "@prisma/client";
import prismaClient from "../libs/prismaClient";
import { productSchema } from "../schemas/product.schema";
import { z } from "@hono/zod-openapi";
import {
  cartIdPayloadSchema,
  cartItemSchema,
  cartPayloadSchema,
} from "../schemas/cart.schema";

type SortType = "asc" | "desc";

export const getCart = async (userId: string) => {
  try {
    const carts = await prismaClient.cart.findFirst({
      where: {
        userId,
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
          userId,
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
    const itemSelected = carts.items.filter((item) => item.selected === true);
    const totalItem = itemSelected.length;
    const totalPrice = carts.items.reduce((acc, item) => {
      if (item.selected) {
        return acc + item.quantity * item.product.price;
      }
      return acc; // Ensure you return the accumulator when not selected
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

export const addItems = async (
  body: z.infer<typeof cartPayloadSchema>,
  userId: string,
) => {
  try {
    const cart = await prismaClient.cart.findFirst({
      where: { userId },
      include: { items: true },
    });
    if (!cart) {
      throw new Error("Cart not found!");
    }
    const product = await prismaClient.product.findUnique({
      where: { id: body.productId },
    });
    if (!product) {
      throw new Error("Product not found!");
    }
    const existingItem = cart.items.find(
      (item) => item.productId === body.productId,
    );
    const totalQuantity = existingItem
      ? existingItem.quantity + body.quantity
      : body.quantity;

    if (totalQuantity > product.stock) {
      throw new Error("insufficient stock for this product");
    }
    if (existingItem) {
      const updateItem = await prismaClient.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: totalQuantity,
        },
      });
    } else {
      const newItem = await prismaClient.cartItem.create({
        data: {
          productId: body.productId,
          quantity: body.quantity,
          cartId: cart.id,
        },
      });
    }
    const updatedCart = await prismaClient.cart.findFirst({
      where: { userId },
      include: {
        items: true,
      },
      //     include: {
      //       product: true, // Include product details for display purposes
      //     },
      //   },
      // },
    });
    return {
      updatedCart,
    };
  } catch (error) {
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
};

export const updateById = async (itemId: string, quantity: number) => {
  const isExist = await prismaClient.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true, product: true },
  });
  if (!isExist) {
    throw new Error("item not found!");
  }

  if (quantity > isExist.product.stock) {
    throw new Error("insufficient stock for this product");
  }
  try {
    const updateProduct = await prismaClient.cartItem.update({
      where: {
        id: itemId,
      },
      data: { quantity },
    });
    if (!updateProduct) {
      throw new Error("Product not found!");
    }

    return {
      product: updateProduct,
    };
  } catch (error: Error | any) {
    return error;
  } finally {
    await prismaClient.$disconnect();
  }
};
export const updateAllSelectedById = async (
  cartId: string,
  select: boolean,
) => {
  const cart = await prismaClient.cart.findUnique({
    where: { id: cartId },
    include: { items: true },
  });

  if (!cart) {
    throw new Error("Cart not found!");
  }

  try {
    if (select) {
      await selectAllItems(cartId);
    } else {
      await unselectAllItems(cartId);
    }
    const updatedCartItems = await fetchCartWithItems(cartId);
    const allSelected = updatedCartItems?.items.every((item) => item.selected);
    const updateCart = await prismaClient.cart.update({
      where: { id: cart.id },
      data: { allSelected },
      include: { items: true },
    });

    return {
      message: "Selection updated successfully",
      updateCart,
    };
  } catch (error: Error | any) {
    throw new Error(error.message || "Failed to update selection.");
  } finally {
    await prismaClient.$disconnect();
  }
};
export const updateSelectedById = async (itemId: string, select: boolean) => {
  try {
    const updateSelect = await prismaClient.cartItem.update({
      where: { id: itemId },
      data: { selected: select },
      include: {
        cart: {
          include: { items: true },
        },
        product: true,
      },
    });

    if (!updateSelect) {
      throw new Error("Update selected failed");
    }

    const mustSelectAll = updateSelect.cart.items.length === 1;
    if (!mustSelectAll) {
      throw new Error("Update selected all failed");
    }
    const updateCart = await prismaClient.cart.update({
      where: { id: updateSelect.cart.id },
      data: { allSelected: true },
      include: { items: true },
    });

    return {
      message: "Selection updated successfully",
      updateCart,
    };
  } catch (error: Error | any) {
    throw new Error(error.message || "Failed to update selection.");
  } finally {
    await prismaClient.$disconnect();
  }
};

export const deleteItemsFromCartById = async (
  itemId: string,
  userId: string,
) => {
  try {
    const isCartExist = await prismaClient.cart.findFirst({
      where: { userId },
      include: { items: true },
    });
    if (!isCartExist) {
      throw new Error("Cart not found!");
    }
    const isItemExist = await prismaClient.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true, product: true },
    });
    if (!isItemExist) {
      throw new Error("Product not found!");
    } else {
      return await prismaClient.cartItem.delete({
        where: { id: isItemExist.id },
        include: {
          product: true,
        },
      });
    }
  } catch (error) {
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
};

export const payment = async (userId: string, cartId: string) => {
  try {
    const cart = await prismaClient.cart.findFirst({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!cart) {
      throw new Error("Cart not found!");
    }

    const itemOrder = cart.items.filter((item) => item.selected === true);

    console.log(itemOrder, "itemss");
    // console.info(body, itemOrder, "orders");
    // const isItemExist = body.some((id) =>
    //   itemOrder.some((item) => item.id === id),
    // );

    if (itemOrder.length === 0) {
      throw new Error("No Item Selected");
    }
    const createdOrder = await prismaClient.order.create({
      data: {
        userId,
        items: {
          create: itemOrder.map((item) => ({
            itemCartId: item.id,
            productId: item.productId,
            quantity: item.quantity,
            productPrice: item.product.price,
          })),
        },
        totalPrice: itemOrder.reduce((acc, item) => {
          return acc + item.quantity * item.product.price;
        }, 0),
        status: "COMPLETED",
      },
      include: {
        user: true,
        items: true,
      },
    });
    console.log(createdOrder, "orde");
    const deleteItemsFromCart = await prismaClient.cartItem.deleteMany({
      where: {
        id: {
          in: createdOrder.items.map((item) => item.itemCartId),
        },
      },
    });
    if (!deleteItemsFromCart) {
      throw new Error("But items failed");
    }

    if (cart.allSelected) {
      await prismaClient.cart.update({
        where: {
          id: cartId,
        },
        data: {
          allSelected: false,
        },
      });
    }
    return {
      createdOrder,
    };
  } catch (error) {
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
};

const unselectAllItems = async (cartId: string) => {
  await prismaClient.cartItem.updateMany({
    where: { cartId },
    data: {
      selected: false,
    },
  });
};

const selectAllItems = async (cartId: string) => {
  await prismaClient.cartItem.updateMany({
    where: { cartId },
    data: {
      selected: true,
    },
  });
};

const fetchCartWithItems = async (cartId: string) => {
  return prismaClient.cart.findFirst({
    where: {
      id: cartId,
    },
    include: {
      items: true,
    },
  });
};

export const getOrders = async (userId: string) => {
  try {
    const orders = await prismaClient.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!orders) {
      throw new Error("Orders not found!");
    }
    return {
      orders,
    };
  } catch (error) {
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
};
export const getOrderByorderId = async (orderId: string) => {
  try {
    const order = await prismaClient.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!order) {
      throw new Error("Orders not found!");
    }
    return {
      order,
    };
  } catch (error) {
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
};

export const buyItemFromOrder = async (orderId: string) => {
  try {
    const order = await prismaClient.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: true,
      },
    });
    if (!order) {
      throw new Error("Order not found!");
    }

    const updateStatusOrder = await prismaClient.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED" },
      include: {
        user: true,
        items: true,
      },
    });

    if (!updateStatusOrder) {
      throw new Error("Buy items failed");
    }
    const deleteItemsFromCart = await prismaClient.cartItem.deleteMany({
      where: {
        id: {
          in: order.items.map((item) => item.id),
        },
      },
    });
    if (!deleteItemsFromCart) {
      throw new Error("But items failed");
    }
    console.info(updateStatusOrder);
    return {
      updateStatusOrder,
    };
  } catch (error) {
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
};
