import { NotFoundError } from "elysia";
import db from "../../db";
import { OrderModel } from "./model";

/**
 * Computes the total price and preparation time for an order.
 *
 * @returns {object} The order object with additional properties:
 *  - orderTotal: The total price of the order.
 *  - preparationTime: The total preparation time for the order.
 */
const computedOrder = (order: any) => {
  const orderTotal = order.items.reduce(
    (acc: number, curr: any) => (acc += curr.item.basePrice * curr.quantity),
    0
  );
  const preparationTime = order.items.reduce(
    (acc: number, curr: any) => (acc += curr.item.preparationTime),
    0
  );

  return {
    ...order,
    orderTotal,
    preparationTime,
  };
};

export const OrderController = {
  /**
   * Retrieves a list of orders from the database, optionally filtered by status.
   */
  async findMany(query: any) {
    try {
      const orders = await db.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              item: true,
              additionalIngredients: true,
            },
          },
        },
        ...(query.status && {
          where: {
            status: query.status,
          },
        }),
      });

      return orders.map(computedOrder);
    } catch (e: unknown) {
      console.error(`Error getting orders: ${e}`);
    }
  },
  /**
   * Finds a single order by its unique identifier.
   */
  async findOne(id: number) {
    try {
      const order = await db.order.findUnique({
        where: { id },
      });

      if (!order) {
        throw new NotFoundError("Order not found.");
      }

      return order;
    } catch (e: unknown) {
      console.error(`Error finding order: ${e}`);
    }
  },
  /**
   * Creating a order
   */
  async create(body: typeof OrderModel.create.static) {
    try {
      const { customer } = body;

      const items = {
        create: body.items.map((item) => ({
          item: { connect: { id: item.id } },
          quantity: item.quantity,
          ...(item.additionalIngredients.length && {
            additionalIngredients: {
              create: item.additionalIngredients.map((a) => ({
                ingredientId: a,
              })),
            },
          }),
        })),
      };

      return await db.order.create({
        data: {
          customerContact: customer.contact,
          customerFullName: customer.fullName,
          items,
        },
      });
    } catch (e: unknown) {
      console.error(`Error creating order: ${e}`);
    }
  },
  /**
   * Updating a order
   */
  async update(id: number, body: any) {
    try {
      return await db.order.update({
        where: { id },
        data: body,
      });
    } catch (e: unknown) {
      console.error(`Error updating order: ${e}`);
    }
  },
  /**
   * Deleting a order
   */
  async delete(id: number) {
    try {
      return await db.order.delete({
        where: { id },
      });
    } catch (e: unknown) {
      console.error(`Error deleting order: ${e}`);
    }
  },
};
