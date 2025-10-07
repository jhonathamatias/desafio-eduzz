export default interface IDepositRepository {
  sumAmounts(accountId: string, currencyId: string): Promise<number>;
}
