import { Elysia, t } from "elysia";
import { IngredientController } from "./controller";

const ingredientRoutes = new Elysia({ prefix: "/ingredients" }).get("/", () =>
  IngredientController.findMany()
);

export default ingredientRoutes;
