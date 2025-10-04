import { Router, type Request, type Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Servidor Express está rodando!');
});

export default router;
