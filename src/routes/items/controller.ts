import { NotFoundError } from "elysia";
import db from "../../db";
import dayjs from "dayjs";
import { ItemBody } from "./model";
import { randomUUIDv7 } from "bun";

/**
 * Controlador para gestionar las operaciones relacionadas con los ítems.
 */
export const ItemController = {
  /**
   * Obtiene una lista de ítems ordenados por nombre en orden descendente.
   * Incluye los ingredientes de cada ítem.
   *
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
      console.error(`Error getting items: ${e}`);
    }
  },
  /**
   * Obtiene las tendencias de los ítems basadas en las órdenes de los últimos 7 días.
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
  /**
   * Crea un nuevo ítem en la base de datos.
   * Maneja la carga de archivos de imagen.
   */
  async create(body: ItemBody) {
    try {
      const ext = body.image.extension;
      const baseDir = "files/items/";
      const newFileName = `${baseDir}${randomUUIDv7()}${ext}`;

      const fileBuffer = Buffer.from(body.image.encodedMedia, "base64");
      const file = new File([fileBuffer], newFileName);

      await Bun.write(newFileName, file);

      const item = await db.item.create({
        data: {
          basePrice: body.basePrice,
          description: body.description,
          image: newFileName,
          name: body.name,
          preparationTime: body.preparationTime,
          ingredients: {
            create: body.ingredients.map(({ id, ingredientQuantity }) => ({
              ingredient: { connect: { id } },
              ingredientQuantity,
            })),
          },
        },
      });

      return item;
    } catch (e: unknown) {
      console.error(`Error creating item: ${e}`);
    }
  },
  /**
   * Elimina un ítem de la base de datos por su ID.
   */
  async delete(itemId: number) {
    try {
      const item = await db.item.findUnique({
        where: { id: itemId },
      });

      if (!item) {
        throw new NotFoundError(`Item with ID ${itemId} not found`);
      }

      await db.item.delete({
        where: { id: itemId },
      });

      return { message: "Item deleted successfully" };
    } catch (e: unknown) {
      console.error(`Error deleting item: ${e}`);
    }
  },
};
