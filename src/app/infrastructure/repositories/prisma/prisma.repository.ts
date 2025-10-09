import { type PrismaClient } from '@prisma/client';

import Collection from '../collection.repository';
import type ICollection from '../interfaces/collection.interface';
import type ICriteria from '../interfaces/criteria.interface';
import type IRepository from '../interfaces/repository.interface';

export default class PrismaRepository implements IRepository {
  private collection: string;

  constructor(protected readonly prisma: PrismaClient) {
    this.collection = '';
  }

  public setCollection(collection: string): void {
    this.collection = this.formatCollectionName(collection);
  }

  public async save(entity: object): Promise<boolean> {
    try {
      console.log('Saving entity to collection:', this.collection, entity);
      await (this.prisma as any)[this.collection].create({ data: entity });
      return true;
    } catch (error) {
      console.error('Error saving entity:', error);
      return false;
    }
  }

  public async getById(id: string): Promise<object | null> {
    return await (this.prisma as any)[this.collection].findUnique({ where: { id } });
  }

  public async findOne(filter: Record<string, any>): Promise<object | null> {
    return await (this.prisma as any)[this.collection].findFirst({ where: filter });
  }

  public async getInsertedLastId(): Promise<string> {
    const lastRecord = await (this.prisma as any)[this.collection].findFirst({
      orderBy: { created_at: 'desc' }
    });
    return lastRecord?.id || '';
  }

  public async update(filter: Record<string, any>, fields: Record<string, any>): Promise<boolean> {
    try {
      await (this.prisma as any)[this.collection].updateMany({ where: filter, data: fields });
      return true;
    } catch (error) {
      console.error('Error updating entity:', error);
      return false;
    }
  }

  public async matching(criteria: ICriteria): Promise<ICollection<object>> {
    const criteriaList = criteria.getCriteriaList();
    const results = await (this.prisma as any)[this.collection].findMany({ where: { AND: criteriaList } });
    return new Collection<object>(results);
  }

  public async updateOne(criteria: ICriteria, fields: Record<string, any>): Promise<boolean> {
    try {
      const criteriaList = criteria.getCriteriaList();
      await (this.prisma as any)[this.collection].update({ where: { AND: criteriaList }, data: fields });
      return true;
    } catch (error) {
      console.error('Error updating entity:', error);
      return false;
    }
  }

  public async count(criteria: ICriteria): Promise<number> {
    const criteriaList = criteria.getCriteriaList();
    return await (this.prisma as any)[this.collection].count({ where: { AND: criteriaList } });
  }

  protected formatCollectionName(name: string): string {
    return name.endsWith('s') ? name.slice(0, -1) : name;
  }
}
