export default interface IApplicationCommand<T = unknown> {
  execute(...args: unknown[]): Promise<T>;
}
