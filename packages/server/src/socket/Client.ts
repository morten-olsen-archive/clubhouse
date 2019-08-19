import { Socket } from 'socket.io';
import { EventEmitter } from 'events';
import MessageStore from '../MessageStore';

interface Message {
  id: string;
  signal: string;
  value: string;
}

interface MessageDto {
  id: string;
  value: string;
}

interface GetDto {
  id: string;
  callId: string;
}

class Client extends EventEmitter {
  private _socket: Socket;
  private _listeners: string[];
  private _store: MessageStore;

  constructor(socket: Socket, store: MessageStore) {
    super();
    this._socket = socket;
    this._listeners = [];
    this._store = store;
    this.onListen = this.onListen.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onGet = this.onGet.bind(this);
    this.onWelcome = this.onWelcome.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    socket.on('listen', this.onListen);
    socket.on('get', this.onGet);
    socket.on('message', this.onMessage);
    socket.once('welcome', this.onWelcome);
    socket.on('disconnect', this.onDisconnect);
  }

  onListen(signal: string) {
    this._listeners.push(signal);
  }

  onMessage(message: MessageDto) {
    this._store.set(message.id, message.value);
    this.emit('message', message);
  }

  async onGet({ callId, id }: GetDto) {
    const value = await this._store.get(id);
    this._socket.emit(`get_${callId}`, value);
  }

  onWelcome() {
    this._socket.emit('welcome', {
      hello: 'world',
    });
  }

  onDisconnect() {
    this.emit('disconnect');
  }

  handleMessage({ signal }: Message) {
    if (this._listeners.includes(signal)) {
      this._listeners = this._listeners.filter((l) => l !== signal);
      this._socket.emit(`signal_${signal}`, {});
    }
  }
}

export default Client;
