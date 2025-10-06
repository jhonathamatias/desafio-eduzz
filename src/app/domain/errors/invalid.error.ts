export class InvalidError extends Error {
  constructor(message: string = 'Invalid operation') {
    super(message);
    this.name = 'InvalidError';
  }
}
