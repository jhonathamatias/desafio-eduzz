export default interface IDepositRepository {
  sumAmountsByAccountId(accountId: string): Promise<number>;
}
