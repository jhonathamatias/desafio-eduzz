import { type Request, type Response, type NextFunction } from 'express';

import { NotFoundError } from '@/app/application/errors';
import { AlreadyExistsError, InvalidError } from '@/app/domain/errors';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): Response {
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }

  if (err instanceof AlreadyExistsError) {
    return res.status(409).json({ error: err.message });
  }

  if (err instanceof InvalidError) {
    return res.status(400).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: 'Unexpected error occurred' });
}
