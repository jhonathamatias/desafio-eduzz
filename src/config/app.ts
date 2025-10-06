import cors from 'cors';
import express from 'express';

import routes from '@/routes';

import { errorHandler } from '../middlewares/error-handler';
const app = express();

app.use(express.json());
app.use(routes);
app.use(cors());
app.use(errorHandler);

export default app;
