import { Router, type Request, type Response } from 'express';

import AccountController from '@/app/controller/account.controller';
import LoginController from '@/app/controller/login.controller';
import { container } from '@/container';
import { authMiddleware } from '@/middlewares/auth.midleware';

const router = Router();

router.post('/account', authMiddleware, (req: Request, res: Response) => {
  const accountController = container.resolve<AccountController>(AccountController.name);
  return accountController.create(req, res);
});

router.post('/account/deposit', authMiddleware, (req: Request, res: Response) => {
  const accountController = container.resolve<AccountController>(AccountController.name);
  return accountController.deposit(req, res);
});

router.get('/account/balance', authMiddleware, (req: Request, res: Response) => {
  const accountController = container.resolve<AccountController>(AccountController.name);
  return accountController.getBalance(req, res);
});

router.post('/login', (req: Request, res: Response) => {
  const loginController = container.resolve<LoginController>(LoginController.name);
  return loginController.login(req, res);
});

router.get('/', (req: Request, res: Response) => {
  res.send('Server running on port!');
});

export default router;
