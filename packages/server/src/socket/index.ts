import socketio from 'socket.io';
import { Server } from 'http';
import { createHash } from 'crypto';
import Client from './Client';
import MessageStore from '../MessageStore';

type PromiseResolveType<Original> = Original extends Promise<infer ReturnType> ? ReturnType : never;

const create = async (server: Server, store: MessageStore) => {
  const app = socketio(server, {
    origins: '*:*',
  });
  let clients: Client[] = [];

  app.on('connect', (socket) => {
    const client = new Client(socket, store);
    clients.push(client);
    client.on('message', (message: any) => {
      const hash = createHash('sha512').update(message.id).digest('hex');
      clients.forEach((c) => c.handleMessage({
        ...message,
        signal: hash,
      }));
    });
    client.on('disconnect', () => {
      clients = clients.filter((c) => c !== client);
    });
  });

  return app;
};

type SocketServer = PromiseResolveType<ReturnType<typeof create>>;

export {
  SocketServer,
};

export default create;
