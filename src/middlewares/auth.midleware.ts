import { type Request, type Response, type NextFunction } from 'express';

import Jwt from '@/app/infrastructure/auth/jwt';
import { container } from '@/container';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const jwt = container.resolve(Jwt.name) as Jwt;
  const authHeader: string | undefined = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  const [_, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  try {
    const decoded = jwt.verifyToken(token) as { accountId: string };

    req.params.accountId = decoded.accountId;
  } catch (error: Error | any) {
    return res.status(401).json({ error: error.message || 'Invalid token' });
  }

  next();
};
