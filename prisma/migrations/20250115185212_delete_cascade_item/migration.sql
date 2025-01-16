-- DropForeignKey
ALTER TABLE "item_ingredient" DROP CONSTRAINT "item_ingredient_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "item_ingredient" DROP CONSTRAINT "item_ingredient_itemId_fkey";

-- AddForeignKey
ALTER TABLE "item_ingredient" ADD CONSTRAINT "item_ingredient_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_ingredient" ADD CONSTRAINT "item_ingredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
