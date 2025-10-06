import fs from 'fs';
import path from 'path';

import Jwt from '../infrastructure/auth/jwt';

export class JwtFactory {
  public static factory(): Jwt {
    const privateKey = fs.readFileSync(path.resolve(process.env.PRIVATE_PEM!), 'utf-8');
    const publicKey = fs.readFileSync(path.resolve(process.env.PUBLIC_PEM!), 'utf-8');

    return new Jwt(privateKey, publicKey);
  }
}
