/*
  Warnings:

  - You are about to drop the column `accountId` on the `deposits` table. All the data in the column will be lost.
  - You are about to drop the column `currencyId` on the `deposits` table. All the data in the column will be lost.
  - Added the required column `account_id` to the `deposits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency_id` to the `deposits` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."deposits" DROP CONSTRAINT "deposits_accountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."deposits" DROP CONSTRAINT "deposits_currencyId_fkey";

-- AlterTable
ALTER TABLE "deposits" DROP COLUMN "accountId",
DROP COLUMN "currencyId",
ADD COLUMN     "account_id" TEXT NOT NULL,
ADD COLUMN     "currency_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
