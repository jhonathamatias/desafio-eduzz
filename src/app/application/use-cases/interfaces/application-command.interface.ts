export default interface IApplicationCommand {
  execute(...args: unknown[]): Promise<unknown>;
}
