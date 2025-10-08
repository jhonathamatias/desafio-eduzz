/*
  Warnings:

  - You are about to drop the `quotes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."quotes" DROP CONSTRAINT "quotes_base_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."quotes" DROP CONSTRAINT "quotes_quote_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."transactions" DROP CONSTRAINT "transactions_related_quote_id_fkey";

-- DropTable
DROP TABLE "public"."quotes";
