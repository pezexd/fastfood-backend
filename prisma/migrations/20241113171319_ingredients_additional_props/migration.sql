-- AlterTable
ALTER TABLE "ingredient" ADD COLUMN     "additionalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "additionalQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0;
