import express from 'express';
import { createHash } from 'crypto';
import createServer, { SocketServer } from './index';
import Transporter from './Transporter';
import TestStore from '../MessageStore/TestStore';

const getHash = (input: string) => createHash('sha512').update(input).digest('hex');

describe('socket', () => {
  describe('server', () => {
    let server: SocketServer;
    let transporter: Transporter;
    let store: TestStore;

    beforeEach(async () => {
      const app = express();
      const http = app.listen(5000);
      store = new TestStore();
      server = await createServer(http, store);
      transporter = new Transporter();
    });

    afterEach(async () => {
      server.close();
      await transporter.teardown();
    });

    it('should be able to setup transporter', async () => {
      await transporter.setup();
    });

    it('should be able to send a message', async () => {
      await transporter.setup();
      await transporter.add('test', 'hello');
    });

    it('should be able to get a message', async () => {
      await transporter.setup();
      await transporter.add('test', 'hello');
      const response = await transporter.get('test');
      expect(response).toBe('hello');
    });

    it('should be able to wait for a message', async () => {
      await transporter.setup();
      const task = transporter.waitForSignal(getHash('msgid'));
      await transporter.add('msgid', 'hello');
      await task;
    });
  });
});
