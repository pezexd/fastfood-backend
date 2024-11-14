import { t } from "elysia";

export const OrderModel = {
  create: t.Object({
    customer: t.Object({
      fullName: t.String({ minLength: 1 }),
      contact: t.String({ minLength: 1 }),
    }),
    items: t.Array(
      t.Object({
        id: t.Numeric(),
        quantity: t.Numeric(),
        additionalIngredients: t.Array(t.Numeric()),
      }),
      {
        minItems: 1,
      }
    ),
  }),
};
