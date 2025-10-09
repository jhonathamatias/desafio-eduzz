import Investment from '@/app/domain/entities/investiment.entity';

describe('Investment Entity', () => {
  it('should calculate the price change percentage correctly', () => {
    const investment = new Investment('1', new Date('2025-01-01'), 1000, 0.05, 'account-1', 30000, 35000);

    const priceChangePercentage = investment.priceChangePercentage();

    expect(priceChangePercentage).toBeCloseTo(16.67, 2); // ((35000 - 30000) / 30000) * 100
  });

  it('should calculate the current gross value correctly', () => {
    const investment = new Investment('1', new Date('2025-01-01'), 1000, 0.05, 'account-1', 30000, 35000);

    const currentGrossValue = investment.currentGrossValue();

    expect(currentGrossValue).toBeCloseTo(1166.67, 2); // 1000 * (35000 / 30000)
  });

  it('should return 0 for price change percentage if current price equals price at buy', () => {
    const investment = new Investment('1', new Date('2025-01-01'), 1000, 0.05, 'account-1', 30000, 30000);

    const priceChangePercentage = investment.priceChangePercentage();

    expect(priceChangePercentage).toBe(0);
  });

  it('should return the invested amount as current gross value if current price equals price at buy', () => {
    const investment = new Investment('1', new Date('2025-01-01'), 1000, 0.05, 'account-1', 30000, 30000);

    const currentGrossValue = investment.currentGrossValue();

    expect(currentGrossValue).toBe(1000);
  });
});
