import { z } from 'zod';

export class Email {
  private readonly value: string;

  constructor(email: string) {
    this.validate(email);
    this.value = email;
  }

  public getValue(): string {
    return this.value;
  }

  protected validate(email: string): boolean {
    const schema = z.email();

    const result = schema.safeParse(email);

    if (!result.success) {
      throw new Error('Invalid format');
    }

    return true;
  }
}
