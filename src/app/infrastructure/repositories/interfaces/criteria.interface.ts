export default interface ICriteria {
  clear(): void;

  /**
   * Returns a list of criteria.
   * @return {Array<Record<string, string | number | boolean>>}
   */
  getCriteriaList(): Array<Record<string, string | number | boolean>>;

  equal(field: string, value: unknown): void;

  orEqual(field: string, value: unknown): void;

  greater(field: string, value: unknown): void;

  lower(field: string, value: unknown): void;

  greaterEqual(field: string, value: unknown): void;

  lowerEqual(field: string, value: unknown): void;

  orderBy(field: string, mode?: string): void;

  rangeDate(field: string, startDate: Date, endDate: Date): void;

  limit(limit: number): void;

  offset(offset: number): void;

  like(field: string, value: unknown): void;
}
