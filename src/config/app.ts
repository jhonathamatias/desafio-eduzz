import cors from 'cors';
import express from 'express';

import registerDependencies from '@/dependecies';
import { errorHandler } from '@/middlewares/error-handler';
import routes from '@/routes';

const app = express();

registerDependencies();

app.use(express.json());
app.use(routes);
app.use(cors());
app.use(errorHandler);

export default app;
