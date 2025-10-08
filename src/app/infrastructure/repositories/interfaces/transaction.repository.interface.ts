import { type TransactionDirection, type TransactionType } from '@/app/application/enums/transaction.enum';

export default interface ITransactionRepository {
  getTotalTransaction(
    accountId: string,
    currencyId: string,
    direction: TransactionDirection,
    type: TransactionType
  ): Promise<number>;
}
