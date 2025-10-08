/*
  Warnings:

  - You are about to drop the column `related_investment_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `related_quote_id` on the `transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."investments" DROP CONSTRAINT "investments_buy_transaction_id_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "related_investment_id",
DROP COLUMN "related_quote_id";
