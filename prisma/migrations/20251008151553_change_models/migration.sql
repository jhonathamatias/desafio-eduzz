/*
  Warnings:

  - You are about to drop the `deposits` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `created_at` on table `accounts` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAW', 'BUY', 'SELL');

-- CreateEnum
CREATE TYPE "TransactionDirection" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "EmailLogType" AS ENUM ('DEPOSIT', 'BUY', 'SELL', 'GENERIC');

-- DropForeignKey
ALTER TABLE "public"."deposits" DROP CONSTRAINT "deposits_account_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."deposits" DROP CONSTRAINT "deposits_currency_id_fkey";

-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "created_at" SET NOT NULL;

-- DropTable
DROP TABLE "public"."deposits";

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "direction" "TransactionDirection" NOT NULL,
    "currency_id" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "related_quote_id" TEXT,
    "related_investment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investments" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "buy_transaction_id" TEXT NOT NULL,
    "base_currency_id" TEXT NOT NULL,
    "quote_currency_id" TEXT NOT NULL,
    "base_amount" DECIMAL(28,8) NOT NULL,
    "quote_amount" DECIMAL(18,2) NOT NULL,
    "price_at_buy" DECIMAL(18,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "base_currency_id" TEXT NOT NULL,
    "quote_currency_id" TEXT NOT NULL,
    "buy_price" DECIMAL(18,2) NOT NULL,
    "sell_price" DECIMAL(18,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_history" (
    "id" TEXT NOT NULL,
    "base_currency_id" TEXT NOT NULL,
    "quote_currency_id" TEXT NOT NULL,
    "buy_price" DECIMAL(18,2) NOT NULL,
    "sell_price" DECIMAL(18,2) NOT NULL,
    "reference_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "EmailLogType" NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transactions_account_id_created_at_idx" ON "transactions"("account_id", "created_at");

-- CreateIndex
CREATE INDEX "transactions_type_created_at_idx" ON "transactions"("type", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "investments_buy_transaction_id_key" ON "investments"("buy_transaction_id");

-- CreateIndex
CREATE INDEX "investments_account_id_is_active_idx" ON "investments"("account_id", "is_active");

-- CreateIndex
CREATE INDEX "quotes_base_currency_id_quote_currency_id_created_at_idx" ON "quotes"("base_currency_id", "quote_currency_id", "created_at");

-- CreateIndex
CREATE INDEX "price_history_reference_time_idx" ON "price_history"("reference_time");

-- CreateIndex
CREATE UNIQUE INDEX "price_history_base_currency_id_quote_currency_id_reference__key" ON "price_history"("base_currency_id", "quote_currency_id", "reference_time");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_related_quote_id_fkey" FOREIGN KEY ("related_quote_id") REFERENCES "quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_buy_transaction_id_fkey" FOREIGN KEY ("buy_transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_base_currency_id_fkey" FOREIGN KEY ("base_currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_quote_currency_id_fkey" FOREIGN KEY ("quote_currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_base_currency_id_fkey" FOREIGN KEY ("base_currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_quote_currency_id_fkey" FOREIGN KEY ("quote_currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_base_currency_id_fkey" FOREIGN KEY ("base_currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_quote_currency_id_fkey" FOREIGN KEY ("quote_currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
