import { Transporter } from 'clubhouse-protocol';
import client, { Socket } from 'socket.io-client';

let currentCallId = 1;

class SocketTransporter implements Transporter {
  private _socket: typeof Socket;

  constructor(url: string) {
    this._socket = client(url, {
      autoConnect: false,
    });
  }

  setup() {
    return new Promise((resolve, reject) => {
      this._socket.on('connect', () => {
        this._socket.once('welcome', () => {
          resolve();
        });
        this._socket.emit('welcome', {});
      });
      this._socket.on('connect_error', (err: any) => {
        reject(err);
      });
      this._socket.open();
    });
  }

  async teardown() {
    this._socket.close();
  }

  async get(id: string) {
    return new Promise<string | undefined>((resolve) => {
      const callId = currentCallId;
      currentCallId += 1;
      this._socket.once(`get_${callId}`, (response: string | undefined) => {
        resolve(response);
      });
      this._socket.emit('get', {
        callId,
        id,
      });
    });
  }

  async add(id: string, value: string) {
    this._socket.emit('message', {
      id,
      value,
    });
  }

  waitForSignal(signal: string) {
    return new Promise<void>((resolve) => {
      this._socket.once(`signal_${signal}`, (data: any) => {
        resolve(data);
      });
      this._socket.emit('listen', signal);
    });
  }
}

export default SocketTransporter;
