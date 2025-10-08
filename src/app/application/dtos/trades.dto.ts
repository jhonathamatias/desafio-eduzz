export type PurchaseBtcDto = {
  accountId: string;
  amount: number;
};

export type GetBTCPriceDto = {
  buy: number;
  sell: number;
  last: number;
};
