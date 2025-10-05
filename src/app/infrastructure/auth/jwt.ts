import { type PrivateKey, type Algorithm, sign, verify } from 'jsonwebtoken';

export default class Jwt {
  protected readonly algorithm: string = 'RS256';

  constructor(
    protected privateKey: string,
    protected publicKey: string
  ) {}

  /**
   * Generate a JWT token with the given payload and expiration time.
   * @param {Object} payload - The payload to include in the token.
   * @param {Number} expiresIn - The expiration time in seconds.
   * @return {String} The generated JWT token.
   */
  public generateToken(payload: object, expiresIn: number): string {
    return sign(payload, this.privateKey as PrivateKey, {
      algorithm: this.algorithm as Algorithm,
      expiresIn: `${expiresIn}s`
    });
  }

  /**
   * Verify the given JWT token and return the decoded payload.
   * @param {String} token - The JWT token to verify.
   * @return {Object|null} The decoded payload if the token is valid, otherwise null.
   * @throws {Error} If the token is invalid or expired.
   */
  public verifyToken(token: string): object | null {
    try {
      return verify(token, this.publicKey, { algorithms: [this.algorithm as Algorithm] }) as object;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
