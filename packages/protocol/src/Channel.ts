import {
  channel,
  members,
  Transporter,
  Keyring,
  ChannelConfig,
  Message,
} from '@morten-olsen/clubhouse-core';
import Queue from './Queue';

type GetConfig = () => Promise<ChannelConfig>;
type SaveConfig = (config: ChannelConfig) => Promise<void>;
type Listener<T = any> = (message: Message<T>) => Promise<void> | void;

class Channel {
  private identity: any;
  private transporter: Transporter;
  private keyring: Keyring;
  private getConfig: GetConfig;
  private setConfig: SaveConfig;
  private queue = new Queue();
  private listeners: Listener[] = [];

  constructor(
    identity: any,
    keyring: Keyring,
    transporter: Transporter,
    getConfig: GetConfig,
    setConfig: SaveConfig,
  ) {
    this.identity = identity;
    this.transporter = transporter;
    this.keyring = keyring;
    this.getConfig = getConfig;
    this.setConfig = setConfig;
  }

  private decryptMessages = async (pkgs: string[]) => {
    return await Promise.all(pkgs.map(async (pkg) => {
      const decrypted = await members.decrypt(
        pkg,
        this.keyring.toPublicKeys(),
        this.identity,
      );
      return {
        ...decrypted,
        message: JSON.parse(decrypted.message),
      };
    }));
  }

  private handleSubscriptions = async (messages: any[]) => {
    try {
      for (let message of messages) {
        for (let listener of this.listeners) {
          await listener(message);
        }
      }
    } catch (err) {
      console.log('err', err);
    }
  }

  subscribe = (listener: Listener) => {
    this.listeners.push(listener);
  }

  unsubscribe = (listener: Listener) => {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  update = () => this.queue.add(async () => {
    const config = await this.getConfig();
    const { pkgs, newConfig } = await channel.getPackages(config, this.transporter);
    await this.setConfig(newConfig);
    const decrypted = await this.decryptMessages(pkgs);
    await this.handleSubscriptions(decrypted);
    return decrypted;
  });

  send = (data: any, receivers: string[] = this.keyring.toPublicKeys()) => this.queue.add(async () => {
    const encrypted = await members.encrypt(
      JSON.stringify(data),
      this.identity,
      receivers,
    );
    const config = await this.getConfig();
    const { pkgs, newConfig } = await channel.send(encrypted, config, this.transporter);
    await this.setConfig(newConfig);
    const decrypted = await this.decryptMessages(pkgs);
    await this.handleSubscriptions(decrypted);
    return decrypted;
  });

  createInvite = (receiver: string, data?: any) => this.queue.add(async () => {
    const config = await this.getConfig();
    const encrypted = await members.encrypt({ config, data }, this.identity, [receiver]);
    return encrypted;
  });

  static create = async (
    identity: any,
    keyring: Keyring,
    transporter: Transporter,
    getConfig: GetConfig,
    setConfig: SaveConfig,
  ) => {
    const config = await channel.createConfig();
    await setConfig(config);
    const newChannel = new Channel(
      identity,
      keyring,
      transporter,
      getConfig,
      setConfig,
    );
    return newChannel;
  }

  static loadInvite = async (
    invite: string,
    identity: any,
    keyring: Keyring,
    transporter: Transporter,
    getConfig: GetConfig,
    setConfig: SaveConfig,
  ) => {
    const { message } = await members.decrypt(invite, keyring.toPublicKeys(), identity);
    const { config, data } = message;
    await setConfig(config);
    const newChannel = new Channel(
      identity,
      keyring,
      transporter,
      getConfig,
      setConfig,
    );
    return {
      channel: newChannel,
      data,
    };
  }
}

export default Channel;