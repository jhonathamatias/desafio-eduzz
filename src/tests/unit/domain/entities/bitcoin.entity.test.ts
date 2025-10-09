import Bitcoin from '@/app/domain/entities/bitcoin.entity';

describe('Bitcoin Entity', () => {
  it('should calculate the correct BTC amount for a valid price', () => {
    const sellPrice = 50000;
    const amount = 1000;
    const bitcoin = new Bitcoin(sellPrice);

    const btcAmount = bitcoin.calculateAmount(amount);

    expect(btcAmount).toBeCloseTo(0.02);
  });

  it('should throw an error if the sell price is zero', () => {
    const sellPrice = 0;
    const amount = 1000;
    const bitcoin = new Bitcoin(sellPrice);

    expect(() => bitcoin.calculateAmount(amount)).toThrow('Invalid Bitcoin price');
  });

  it('should throw an error if the sell price is negative', () => {
    const sellPrice = -50000;
    const amount = 1000;
    const bitcoin = new Bitcoin(sellPrice);

    expect(() => bitcoin.calculateAmount(amount)).toThrow('Invalid Bitcoin price');
  });
});
