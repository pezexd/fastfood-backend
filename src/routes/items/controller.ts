import { NotFoundError } from "elysia";
import db from "../../db";
import dayjs from "dayjs";

export const ItemController = {
  /**
   * Get items
   */
  async findMany() {
    try {
      const items = await db.item.findMany({
        orderBy: { name: "desc" },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });

      return items;
    } catch (e: unknown) {
      console.error(`Error getting orders: ${e}`);
    }
  },
  /**
   *  Get items with trends
   */
  async findTrends() {
    try {
      const sevenDaysAgo = dayjs().subtract(7, "days").format();

      const orders = await db.order.findMany({
        orderBy: { createdAt: "asc" },
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        include: {
          items: {
            include: {
              item: true,
            },
          },
        },
      });

      const itemTrending: Record<
        number,
        {
          itemName: string;
          trends: { orderDate: string; orders: 0; totalQuantity: 0 }[];
        }
      > = {};

      orders.forEach((order) => {
        order.items.forEach((orderItem) => {
          const item = orderItem.item;
          const itemId = item.id;
          const itemName = item.name;

          if (!itemTrending[itemId]) {
            itemTrending[itemId] = {
              itemName,
              trends: [],
            };
          }

          const orderDate = dayjs(order.createdAt);
          let trendIndex = itemTrending[itemId].trends.findIndex((trend) =>
            orderDate.isSame(dayjs(trend.orderDate), "date")
          );

          if (trendIndex < 0) {
            itemTrending[itemId].trends.push({
              orderDate: orderDate.format(),
              orders: 0,
              totalQuantity: 0,
            });
          }

          trendIndex = itemTrending[itemId].trends.findIndex((trend) =>
            orderDate.isSame(dayjs(trend.orderDate), "date")
          );

          itemTrending[itemId].trends[trendIndex].orders++;
          itemTrending[itemId].trends[trendIndex].totalQuantity +=
            orderItem.quantity;
        });
      });

      return itemTrending;
    } catch (e: unknown) {
      console.error(`Error getting items trends: ${e}`);
    }
  },
};
