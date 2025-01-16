import { t } from "elysia";

const itemBody = t.Object({
  name: t.String(),
  description: t.String(),
  basePrice: t.Number({ minimum: 1 }),
  preparationTime: t.Number(),
  image: t.Object({
    extension: t.String(),
    encodedMedia: t.String(),
  }),
  ingredients: t.Array(
    t.Object({
      id: t.Number(),
      ingredientQuantity: t.Number(),
    }),
    {
      minItems: 0,
    }
  ),
});

type ItemBody = typeof itemBody.static;

export { itemBody, ItemBody };
