import db from "../../db";
import dayjs from "dayjs";
import isSameOrAfterPlugin from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfterPlugin);

export const ReportsControllers = {
  /**
   * Get items
   */
  async findMany() {
    try {
      const ingredients = await db.ingredient.findMany({
        orderBy: { name: "desc" },
      });
      return ingredients;
    } catch (e: unknown) {
      console.error(`Error getting orders: ${e}`);
    }
  },
  /**
   * Get frequent customers analysis
   */
  async getFrequentCustomers() {
    try {
      const frequentCustomers = await db.order.groupBy({
        by: ["customerFullName"],
        _count: {
          customerFullName: true,
        },
        orderBy: {
          _count: {
            customerFullName: "desc",
          },
        },
      });

      return frequentCustomers;
    } catch (e: unknown) {
      console.error(`Error getting frequent customers: ${e}`);
    }
  },
  async getSales() {
    try {
      const orders = await db.order.findMany({
        orderBy: { createdAt: "asc" },
        include: {
          items: {
            include: {
              item: true,
            },
          },
        },
      });

      const productSales = orders.reduce((acc, order) => {
        order.items.forEach((orderItem) => {
          const itemId = orderItem.item.id;
          const itemName = orderItem.item.name;
          const quantity = orderItem.quantity;

          if (!acc[itemId]) {
            acc[itemId] = { itemName, totalQuantity: 0 };
          }

          acc[itemId].totalQuantity += quantity;
        });

        return acc;
      }, {} as Record<number, { itemName: string; totalQuantity: number }>);

      const sortedProductSales = Object.values(productSales).sort(
        (a, b) => b.totalQuantity - a.totalQuantity
      );

      const dailySales = orders.reduce((acc, order) => {
        const orderDate = dayjs(order.createdAt).format("YYYY-MM-DD");
        if (!acc[orderDate]) {
          acc[orderDate] = { totalSales: 0, totalOrders: 0 };
        }
        acc[orderDate].totalSales += order.items.reduce(
          (sum, item) => sum + item.quantity * item.item.basePrice,
          0
        );
        acc[orderDate].totalOrders += 1;
        return acc;
      }, {} as Record<string, { totalSales: number; totalOrders: number }>);

      const sortedDailySales = Object.entries(dailySales)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => (dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1));

      const weeklySales = orders.reduce((acc, order) => {
        const week = dayjs(order.createdAt)
          .startOf("week")
          .format("YYYY-MM-DD");
        if (!acc[week]) {
          acc[week] = { totalSales: 0, totalOrders: 0 };
        }
        acc[week].totalSales += order.items.reduce(
          (sum, item) => sum + item.quantity * item.item.basePrice,
          0
        );
        acc[week].totalOrders += 1;
        return acc;
      }, {} as Record<string, { totalSales: number; totalOrders: number }>);

      const sortedWeeklySales = Object.entries(weeklySales)
        .map(([week, data]) => ({ week, ...data }))
        .sort((a, b) => (dayjs(a.week).isAfter(dayjs(b.week)) ? 1 : -1));

      return {
        productSales: sortedProductSales,
        dailySales: sortedDailySales,
        weeklySales: sortedWeeklySales,
      };
    } catch (e: unknown) {
      console.error(`Error getting items trends: ${e}`);
    }
  },
  async getInventory({ query }: any) {
    try {
      const products = await db.item.findMany({
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
          orderItems: {
            select: {
              quantity: true,
              item: true,
              order: true,
            },
          },
        },
      });

      const sinceDays = (query && query.sinceDays) || -1;

      const filteredProducts = products.map((product) => ({
        ...product,
        orderItems: product.orderItems.filter((orderItem) => {
          const aDate = dayjs(orderItem.order.createdAt);
          const bDate = dayjs().add(Number(sinceDays), "days");

          return aDate.isSameOrAfter(bDate);
        }),
      }));

      const inventory = filteredProducts.reduce((acc, product) => {
        product.ingredients.forEach((ingredient) => {
          if (!acc[ingredient.id]) {
            acc[ingredient.id] = {
              ingredientName: ingredient.ingredient.name,
              currentStock: ingredient.ingredient.quantity,
              totalUsed: 0,
              projectedStock: ingredient.ingredient.quantity,
            };
          }

          const totalUsed = product.orderItems.reduce((orderAcc, orderItem) => {
            return (
              orderAcc + orderItem.quantity * ingredient.ingredientQuantity
            );
          }, 0);

          acc[ingredient.id].totalUsed += totalUsed;
          acc[ingredient.id].projectedStock -= totalUsed;
        });

        return acc;
      }, {} as Record<number, { ingredientName: string; currentStock: number; totalUsed: number; projectedStock: number }>);

      return Object.values(inventory);
    } catch (e: unknown) {
      console.error(`Error getting inventory: ${e}`);
    }
  },
};
