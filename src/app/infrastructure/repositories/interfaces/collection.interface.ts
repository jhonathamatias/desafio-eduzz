export default interface ICollection<T> extends Iterable<T> {
  add(item: T): void;

  remove(item: T): void;

  toArray(): T[];

  count(): number;

  getIterator(): Iterator<T>;

  first(): T | null;

  last(): T | null;

  setItems(items: T[]): void;
}
