import type ICollection from './collection.interface';
import type ICriteria from './criteria.interface';

export default interface IRepository {
  setCollection(collection: string): void;

  save(entity: object): Promise<boolean>;

  getById(id: string): Promise<object | null>;

  findOne(filter: Record<string, any>): Promise<object | null>;

  getInsertedLastId(): Promise<string>;

  update(filter: Record<string, any>, fields: Record<string, any>): Promise<boolean>;

  matching(criteria: ICriteria): Promise<ICollection<object>>;

  updateOne(criteria: ICriteria, fields: Record<string, any>): Promise<boolean>;

  count(criteria: ICriteria): Promise<number>;
}
