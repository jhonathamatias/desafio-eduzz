import * as fs from 'fs';
import * as path from 'path';

import JwtAuth from '@/app/infrastructure/auth/jwt';

const privateKey = fs.readFileSync(path.resolve(__dirname, './keys/private.pem'), 'utf-8');
const publicKey = fs.readFileSync(path.resolve(__dirname, './keys/public.pem'), 'utf-8');

describe('JwtAuth', () => {
  let jwtAuth: JwtAuth;

  beforeEach(() => {
    jwtAuth = new JwtAuth(privateKey, publicKey);
  });

  it('should generate a valid token for a given payload', () => {
    const payload = { user_id: '550e8400-e29b-41d4-a716-446655440000' };
    const token = jwtAuth.generateToken(payload, 60);

    expect(typeof token).toBe('string');
    expect(token).toBeTruthy();
  });

  it('should verify a valid token and return the decoded payload', () => {
    const payload = { user_id: '550e8400-e29b-41d4-a716-446655440000' };
    const token = jwtAuth.generateToken(payload, 60);

    const decoded = jwtAuth.verifyToken(token) as { user_id: string };

    expect(decoded?.user_id).toBe(payload.user_id);
    expect(decoded).toMatchObject(payload);
  });

  it('should throw an error for an invalid token', () => {
    const invalidToken = 'invalid.token.here';

    expect(() => jwtAuth.verifyToken(invalidToken)).toThrow('Invalid token');
  });
});
