import {
  Keyring,
  Channel,
  Message,
  Transporter,
} from '@morten-olsen/clubhouse-protocol';
import { Rules, Config } from './types';
import BuildIns from './rules';

export interface Options<ConfigType = any> {
  channel: Channel;
  getConfig: () => Promise<Config<ConfigType>>;
  setConfig: (config: Config<ConfigType>) => Promise<void>;
  rules: Rules;
}

export type Listener<MessageType> = (message: MessageType) => void;

const socialize = <MessageResponseType = any, ConfigType = any>({
  channel,
  getConfig,
  setConfig,
  rules,
}: Options<ConfigType>) => {
  let listeners: Listener<MessageResponseType>[] = [];

  const subscription = async (message: Message) => {
    const config = await getConfig();
    const rule = await rules.get<MessageResponseType>(config.ruleName);
    const keyring = new Keyring();
    await keyring.addKeys(config.members);
    const newMessage = await rule({
      config,
      keyring,
      message,
      setConfig,
    });
    if (newMessage === null) return;

    listeners.forEach((listener) => listener(newMessage));
  };

  channel.subscribe(subscription);

  return {
    send: async (data: any) => {
      await channel.send(data);
    },
    subscribe: (listener: Listener<any>) => {
      listeners.push(listener);
    },
    unsubscribe: (listener: Listener<any>) => {
      listeners = listeners.filter((l) => l !== listener);
    },
    update: async () => {
      await channel.update();
    },
    destroy: () => channel.unsubscribe(subscription),
    invite: async (receiver: string) => {
      const config = await getConfig();
      const invite = await channel.createInvite(receiver, config);
      return invite;
    },
  };
};

export const fromInvite = async (
  invite: string,
  identity: any,
  keyring: Keyring,
  transporter: Transporter,
  getChannelConfig: () => Promise<any>,
  setChannelConfig: (config: any) => Promise<void>,
  getSocialConfig: () => Promise<any>,
  setSocialConfig: (config: any) => Promise<void>,
  rules: Rules,
) => {
  const { channel, data } = await Channel.loadInvite(
    invite,
    identity,
    keyring,
    transporter,
    getChannelConfig,
    setChannelConfig,
  );
  await setSocialConfig(data);
  const social = socialize({
    channel,
    getConfig: getSocialConfig,
    setConfig: setSocialConfig,
    rules,
  });
  return {
    social,
    channel,
  };
};

type SocialType = ReturnType<typeof socialize>;

export {
  SocialType,
  BuildIns,
};

export default socialize;
