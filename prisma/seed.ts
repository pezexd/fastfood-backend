import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

const ingredientsToCreate = [
  {
    id: 1,
    name: "Carne",
    quantity: 1000,
    unit: "Gram",
  },
  {
    id: 2,
    name: "Queso amarillo",
    quantity: 10,
    unit: "Slice",
  },
];

const itemsToCreate = [
  {
    id: 1,
    name: "Cheese Burger",
    description: "120gr de carne, 2 rodajas de queso",
    basePrice: 5.2,
    image:
      "https://rustlersonline.com/wp-content/uploads/2020/09/Cheeseburger-5-396x295.png",
    preparationTime: 5,
    ingredients: {
      create: [
        { ingredient: { connect: { id: 1 } }, ingredientQuantity: 120 },
        { ingredient: { connect: { id: 2 } }, ingredientQuantity: 2 },
      ],
    },
  },
];

const paymentMethodsToCreate = [
  {
    id: 1,
    name: "Pago Movil",
    description: "30331556 - 04148640550 - Venezuela",
  },
];

const seedIngredients = async (ingredients: any) => {
  console.log("Creating ingredients ...");

  for (const ingredient of ingredients) {
    console.log("Creating ingredient:", ingredient);
    await client.ingredient.upsert({
      where: { id: ingredient.id },
      update: ingredient,
      create: ingredient,
    });
  }
};

const seedItems = async (items: any) => {
  console.log("Creating items ...");

  for (const item of items) {
    console.log("Creating item:", item);
    await client.item.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
};

const seedPaymentMethods = async (paymentMethods: any) => {
  console.log("Creating payment methods ...");

  for (const item of paymentMethods) {
    console.log("Creating payment method:", item);
    await client.paymentMethod.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
};

Promise.all([
  seedIngredients(ingredientsToCreate),
  seedItems(itemsToCreate),
  seedPaymentMethods(paymentMethodsToCreate),
])
  .then(() => {
    console.log("Created/Updated successfully.");
  })
  .catch((error) => {
    console.error("Error:", error);
  })
  .finally(() => {
    client.$disconnect();
    console.log("Disconnected Prisma Client, exiting.");
  });
