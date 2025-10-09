export default class InvestimentEntity {
  constructor(
    public id: string,
    public purchaseAt: Date,
    public investedAmount: number,
    public baseAmount: number,
    public accountId: string,
    public priceAtBuy: number,
    public currentPrice: number
  ) {}

  public priceChangePercentage(): number {
    return ((this.currentPrice - this.priceAtBuy) / this.priceAtBuy) * 100;
  }

  public currentGrossValue(): number {
    return this.investedAmount * (this.currentPrice / this.priceAtBuy);
  }
}
