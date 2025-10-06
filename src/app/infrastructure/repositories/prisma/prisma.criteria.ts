import type ICriteria from '../interfaces/criteria.interface';

export default class PrismaCriteria implements ICriteria {
  private criteriaList: Array<Record<string, any>> = [];
  private orderByList: Array<Record<string, string>> = [];
  private limitValue?: number;
  private offsetValue?: number;

  public clear(): void {
    this.criteriaList = [];
    this.orderByList = [];
    this.limitValue = undefined;
    this.offsetValue = undefined;
  }

  public getCriteriaList(): Array<Record<string, string | number | boolean>> {
    return this.criteriaList;
  }

  public equal(field: string, value: string | number | boolean): void {
    this.criteriaList.push({ [field]: value });
  }

  public orEqual(field: string, value: unknown): void {
    this.criteriaList.push({ OR: [{ [field]: value }] });
  }

  public greater(field: string, value: unknown): void {
    this.criteriaList.push({ [field]: { gt: value } });
  }

  public lower(field: string, value: unknown): void {
    this.criteriaList.push({ [field]: { lt: value } });
  }

  public greaterEqual(field: string, value: unknown): void {
    this.criteriaList.push({ [field]: { gte: value } });
  }

  public lowerEqual(field: string, value: unknown): void {
    this.criteriaList.push({ [field]: { lte: value } });
  }

  public orderBy(field: string, mode: string = 'asc'): void {
    this.orderByList.push({ [field]: mode });
  }

  public rangeDate(field: string, startDate: Date, endDate: Date): void {
    this.criteriaList.push({ [field]: { gte: startDate, lte: endDate } });
  }

  public limit(limit: number): void {
    this.limitValue = limit;
  }

  public offset(offset: number): void {
    this.offsetValue = offset;
  }

  public like(field: string, value: unknown): void {
    this.criteriaList.push({ [field]: { contains: value } });
  }

  public build(): Record<string, any> {
    const query: Record<string, any> = {
      where: { AND: this.criteriaList }
    };

    if (this.orderByList.length > 0) {
      query.orderBy = this.orderByList;
    }

    if (this.limitValue !== undefined) {
      query.take = this.limitValue;
    }

    if (this.offsetValue !== undefined) {
      query.skip = this.offsetValue;
    }

    return query;
  }
}
