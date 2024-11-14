import { Elysia, t } from "elysia";
import { OrderModel } from "./model";
import { OrderController } from "./controller";

const ordersRoutes = new Elysia({ prefix: "/orders" })
  .get("/", () => OrderController.findMany())
  .get("/:id", ({ params: { id } }) => OrderController.findOne(id), {
    params: t.Object({
      id: t.Numeric(),
    }),
  })
  .post("/", ({ body }) => OrderController.create(body), {
    body: OrderModel.create,
  })
  .post(
    "/:id/status",
    ({ params: { id }, body }) => OrderController.update(id, body),
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object(
        {
          status: t.UnionEnum([
            "REJECTED",
            "PENDING",
            "READY",
            "DELIVERED",
            "NOT_PAID",
            "COMPLETED",
          ]),
        },
        { minProperties: 1 }
      ),
    }
  )
  .patch(
    "/:id",
    ({ params: { id }, body }) => OrderController.update(id, body),
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({}, { minProperties: 1 }),
    }
  )
  .delete("/", ({ params: { id } }) => OrderController.delete(id), {
    params: t.Object({
      id: t.Numeric(),
    }),
  });

export default ordersRoutes;