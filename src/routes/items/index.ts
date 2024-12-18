import { Elysia, t } from "elysia";
import { ItemController } from "./controller";

const itemsRoutes = new Elysia({ prefix: "/items" })
  .get("/", () => ItemController.findMany())
  .get("/trends", () => ItemController.findTrends());

export default itemsRoutes;
