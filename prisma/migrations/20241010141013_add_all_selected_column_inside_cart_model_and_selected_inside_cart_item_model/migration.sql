-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "selected" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "allSelected" BOOLEAN NOT NULL DEFAULT false;
