import { Router, type Request, type Response } from 'express';

import AccountController from '@/app/controller/account.controller';
import LoginController from '@/app/controller/login.controller';
import TradeController from '@/app/controller/trade.controller';
import { container } from '@/container';
import { authMiddleware } from '@/middlewares/auth.midleware';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const loginController = container.resolve<LoginController>(LoginController.name);
  return loginController.login(req, res);
});

router.post('/account', (req: Request, res: Response) => {
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

router.get('/btc/price', authMiddleware, (req: Request, res: Response) => {
  const tradeController = container.resolve<TradeController>(TradeController.name);
  return tradeController.getBitcoinPrice(req, res);
});

router.post('/btc/purchase', authMiddleware, (req: Request, res: Response) => {
  const tradeController = container.resolve<TradeController>(TradeController.name);
  return tradeController.purchaseBTC(req, res);
});

router.post('/btc/sell', authMiddleware, (req: Request, res: Response) => {
  const tradeController = container.resolve<TradeController>(TradeController.name);
  return tradeController.sellBTC(req, res);
});

router.get('/volume', authMiddleware, (req: Request, res: Response) => {
  const tradeController = container.resolve<TradeController>(TradeController.name);
  return tradeController.getDailyBTCTotal(req, res);
});

router.get('/extract', authMiddleware, (req: Request, res: Response) => {
  const accountController = container.resolve<AccountController>(AccountController.name);
  return accountController.getTransactionsStatement(req, res);
});

router.get('/history', authMiddleware, (req: Request, res: Response) => {
  const tradeController = container.resolve<TradeController>(TradeController.name);
  return tradeController.getHistoryBTCPrice(req, res);
});

router.get('/btc/position', authMiddleware, (req: Request, res: Response) => {
  const tradeController = container.resolve<TradeController>(TradeController.name);
  return tradeController.getInvestmentsPositions(req, res);
});

router.get('/', (req: Request, res: Response) => {
  res.send('Server running on port!');
});

export default router;
