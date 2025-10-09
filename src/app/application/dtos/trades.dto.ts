export type PurchaseBtcDto = {
  accountId: string;
  amount: number;
};

export type GetBTCPriceDto = {
  buy: number;
  sell: number;
  last: number;
};

export type GetInvestmentPositionDto = {
  purchaseDate: Date;
  investedAmount: number;
  btcPriceAtPurchase: number;
  priceVariationPercentage: number;
  currentGrossValue: number;
};
