import express, { Application } from 'express';

import routes from './routes';

export const createApp = (): Application => {
  const app = express();

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api', routes);

  return app;
};

