export default interface IMail {
  send(to: string, subject: string, body: string): Promise<void>;
}
