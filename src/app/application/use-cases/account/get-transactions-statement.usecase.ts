import { type ITransactionRepository } from '@/app/infrastructure/repositories/interfaces';

export default class GetTransactionsStatementUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  public async execute(accountId: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    return await this.transactionRepository.getStatement(accountId, startDate, endDate);
  }
}
