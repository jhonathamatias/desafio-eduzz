export default class Bitcoin {
  constructor(public sellPrice: number) {}

  public calculateAmount(amount: number): number {
    if (this.sellPrice <= 0) {
      throw new Error('Invalid Bitcoin price');
    }

    return amount / this.sellPrice;
  }
}
