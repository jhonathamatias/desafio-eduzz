import { InvestimentEntity } from '@/app/domain/entities';
import { type ICollection, type ICriteria, type IRepository } from '@/app/infrastructure/repositories/interfaces';

import { type GetInvestmentPositionDto } from '../../dtos';
import type IApplicationCommand from '../interfaces/application-command.interface';

interface Investment {
  id: string;
  created_at: string;
  quote_amount: number;
  base_amount: number;
  account_id: string;
  price_at_buy: number;
  current_price: number;
}

export class GetInvestmentsPositionsUseCase implements IApplicationCommand<GetInvestmentPositionDto[]> {
  constructor(
    protected readonly repository: IRepository,
    protected readonly criteria: ICriteria,
    protected readonly getCurrentBTCPriceUseCase: IApplicationCommand<{ buy: number; sell: number }>
  ) {}

  public async execute(accountId: string): Promise<GetInvestmentPositionDto[]> {
    const investments = await this.getInvestments(accountId);
    const btcPrice = await this.getCurrentBTCPriceUseCase.execute();

    const positions = [...investments].map(investment => {
      const investimentEntity = new InvestimentEntity(
        investment.id,
        new Date(investment.created_at),
        investment.quote_amount,
        investment.base_amount,
        investment.account_id,
        investment.price_at_buy,
        btcPrice.sell
      );

      const priceVariationPercentage = investimentEntity.priceChangePercentage();
      const currentGrossValue = investimentEntity.currentGrossValue();

      return {
        purchaseDate: new Date(investment.created_at),
        investedAmount: Number(investment.quote_amount),
        btcPriceAtPurchase: Number(investment.base_amount),
        priceVariationPercentage: Number(priceVariationPercentage.toFixed(2)),
        currentGrossValue: Number(currentGrossValue.toFixed(2))
      };
    });

    return positions;
  }

  protected getInvestments(accountId: string): Promise<ICollection<Investment>> {
    this.repository.setCollection('investment');

    this.criteria.clear();
    this.criteria.equal('account_id', accountId);
    this.criteria.equal('is_active', true);
    this.criteria.orderBy('created_at', 'asc');

    return this.repository.matching(this.criteria) as Promise<ICollection<Investment>>;
  }
}
