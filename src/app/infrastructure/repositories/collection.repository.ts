import type { ICollection } from '@/app/infrastructure/repositories/interfaces';

export default class Collection<T> implements ICollection<T> {
  private items: T[] = [];

  constructor(initialItems?: T[]) {
    if (initialItems) {
      this.items = [...initialItems];
    }
  }

  public add(item: T): void {
    this.items.push(item);
  }

  public remove(item: T): void {
    const index = this.items.indexOf(item);

    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  public toArray(): T[] {
    return [...this.items];
  }

  public count(): number {
    return this.items.length;
  }

  public getIterator(): Iterator<T> {
    return this.items[Symbol.iterator]();
  }

  public first(): T | null {
    return this.items.length > 0 ? this.items[0] : null;
  }

  public last(): T | null {
    return this.items.length > 0 ? this.items[this.items.length - 1] : null;
  }

  public setItems(items: T[]): void {
    this.items = [...items];
  }

  public [Symbol.iterator](): Iterator<T> {
    return this.getIterator();
  }
}
