import db from "../../db";

export const IngredientController = {
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
  async create(body: any) {
    try {
      const id = (await db.ingredient.count()) + 1;

      return await db.ingredient.create({
        data: {
          id,
          name: body.name,
          quantity: body.quantity,
          unit: body.unit,
        },
      });
    } catch (e: unknown) {
      console.error(`Error creating ingredient: ${e}`);
    }
  },
};
