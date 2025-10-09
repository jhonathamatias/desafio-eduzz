export default interface IBitcoinHistoryRepository {
  recordPrice(price: number): Promise<void>;
  getHistory(): Promise<{ price: number; date: Date }[]>;
}
