import { Elysia, t } from "elysia";
import { ReportsControllers } from "./controllers";

const reportsRoutes = new Elysia({ prefix: "/reports" })
  .get("/", () => ReportsControllers.findMany())
  .get("/customers", () => ReportsControllers.getFrequentCustomers())
  .get("/sales", () => ReportsControllers.getSales())
  .get("/inventory", ({ query }) => ReportsControllers.getInventory({ query }));

export default reportsRoutes;
