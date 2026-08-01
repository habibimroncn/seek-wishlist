/*
  Warnings:

  - You are about to drop the column `shop` on the `Wishlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customerId,variantId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Wishlist_shop_customerId_idx";

-- DropIndex
DROP INDEX "Wishlist_shop_customerId_variantId_key";

-- AlterTable
ALTER TABLE "Wishlist" DROP COLUMN "shop";

-- CreateIndex
CREATE INDEX "Wishlist_customerId_idx" ON "Wishlist"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_customerId_variantId_key" ON "Wishlist"("customerId", "variantId");
