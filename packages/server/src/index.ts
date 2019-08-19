import express from 'express';
import createServer from './socket';
import TestStore from './MessageStore/TestStore';

const start = async () => {
  const app = express();
  app.get('/status', (req, res) => {
    res.end('running');
  });
  const http = app.listen(process.env.PORT || 5000);
  const store = new TestStore();
  await createServer(http, store);
};

start().catch((err) => console.error(err));
