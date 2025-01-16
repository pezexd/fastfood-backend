import { Elysia, t } from "elysia";
import { ItemController } from "./controller";
import { itemBody } from "./model";

const itemsRoutes = new Elysia({ prefix: "/items" })
  .get("/", () => ItemController.findMany())
  .post("/", ({ body }) => ItemController.create(body), {
    body: itemBody,
  })
  .delete("/:id", ({ params: { id } }) => ItemController.delete(id), {
    params: t.Object({
      id: t.Numeric(),
    }),
  })
  .get("/trends", () => ItemController.findTrends());

export default itemsRoutes;
