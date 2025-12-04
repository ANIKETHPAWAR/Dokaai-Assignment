import http from 'http';
import { AddressInfo } from 'net';

import { createApp } from './app';
import { seedDemoData } from './utils/seed';

const PORT = Number(process.env.PORT ?? 3000);

const app = createApp();
const server = http.createServer(app);

const startServer = () => {
  seedDemoData();

  server.listen(PORT, () => {
    const address = server.address() as AddressInfo;
    console.info(`Notification service listening on port ${address.port}`);
  });
};

const shutdown = (signal: string) => {
  console.warn(`${signal} received. Closing server...`);
  server.close((error) => {
    if (error) {
      console.error('Error during server shutdown', error);
      process.exit(1);
    }
    process.exit(0);
  });
};

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});

startServer();

