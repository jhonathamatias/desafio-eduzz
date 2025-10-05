export default class AlreadyExistsError extends Error {
  constructor(message: string = 'Resource already exists') {
    super(message);
    this.name = 'AlreadyExistsError';
  }
}
