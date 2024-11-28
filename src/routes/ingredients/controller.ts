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
};
