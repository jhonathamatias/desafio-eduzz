import { PrismaClient } from '@prisma/client';

import Collection from '../collection.repository';
import type ICollection from '../interfaces/collection.interface';
import type ICriteria from '../interfaces/criteria.interface';
import type IRepository from '../interfaces/repository.interface';

export default class PrismaRepository implements IRepository {
  private prisma: PrismaClient;
  private collection: string;

  constructor() {
    this.prisma = new PrismaClient();
    this.collection = '';
  }

  public setCollection(collection: string): void {
    this.collection = collection;
  }

  public async save(entity: object): Promise<boolean> {
    try {
      await this.prisma[this.collection].create({ data: entity });
      return true;
    } catch (error) {
      console.error('Error saving entity:', error);
      return false;
    }
  }

  public async getById(id: string): Promise<object | null> {
    return await this.prisma[this.collection].findUnique({ where: { id } });
  }

  public async findOne(filter: Record<string, any>): Promise<object | null> {
    return await this.prisma[this.collection].findFirst({ where: filter });
  }

  public async getInsertedLastId(): Promise<string> {
    const lastRecord = await this.prisma[this.collection].findFirst({
      orderBy: { id: 'desc' }
    });
    return lastRecord?.id || '';
  }

  public async update(filter: Record<string, any>, fields: Record<string, any>): Promise<boolean> {
    try {
      await this.prisma[this.collection].updateMany({ where: filter, data: fields });
      return true;
    } catch (error) {
      console.error('Error updating entity:', error);
      return false;
    }
  }

  public async matching(criteria: ICriteria): Promise<ICollection<object>> {
    const criteriaList = criteria.getCriteriaList();
    const results = await this.prisma[this.collection].findMany({ where: { AND: criteriaList } });
    return new Collection<object>(results);
  }

  public async updateOne(criteria: ICriteria, fields: Record<string, any>): Promise<boolean> {
    try {
      const criteriaList = criteria.getCriteriaList();
      await this.prisma[this.collection].update({ where: { AND: criteriaList }, data: fields });
      return true;
    } catch (error) {
      console.error('Error updating entity:', error);
      return false;
    }
  }

  public async count(criteria: ICriteria): Promise<number> {
    const criteriaList = criteria.getCriteriaList();
    return await this.prisma[this.collection].count({ where: { AND: criteriaList } });
  }
}
