-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_orderId_fkey";

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
