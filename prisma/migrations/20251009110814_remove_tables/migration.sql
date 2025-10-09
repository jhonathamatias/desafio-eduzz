/*
  Warnings:

  - You are about to drop the `email_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `price_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."email_logs" DROP CONSTRAINT "email_logs_account_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."price_history" DROP CONSTRAINT "price_history_base_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."price_history" DROP CONSTRAINT "price_history_quote_currency_id_fkey";

-- DropTable
DROP TABLE "public"."email_logs";

-- DropTable
DROP TABLE "public"."price_history";
