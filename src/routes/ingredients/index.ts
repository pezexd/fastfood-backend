import { Elysia, t } from "elysia";
import { IngredientController } from "./controller";

const ingredientRoutes = new Elysia({ prefix: "/ingredients" })
  .get("/", () => IngredientController.findMany())
  .post("/", ({ body }) => IngredientController.create(body));

export default ingredientRoutes;
