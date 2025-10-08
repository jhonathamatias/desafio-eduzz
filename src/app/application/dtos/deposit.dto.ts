export type DepositDto = {
  accountId: string;
  amount: number;
};

export type DepositNotificationDto = {
  accountId: string;
  email: string;
  name: string;
  amount: number;
  currencyId: string;
};
