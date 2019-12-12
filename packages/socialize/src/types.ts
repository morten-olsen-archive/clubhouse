import { Keyring, Message } from '@morten-olsen/clubhouse-protocol';

export interface Config<ConfigType> {
  ruleName: string;
  members: string[];
  data: ConfigType;
}

export interface RuleApi<ConfigType, MessageType> {
  message: Message<MessageType>;
  keyring: Keyring;
  config: Config<ConfigType>;
  setConfig: (config: Config<ConfigType>) => Promise<void>;
}

export type RuleRunner<MessageResponseType, ConfigType, MessageType>
  = (api: RuleApi<ConfigType, MessageType>) => Promise<MessageResponseType | null>

export interface Rules {
  get: <MessageResponseType>(name: string) => Promise<RuleRunner<MessageResponseType, any, any>>;
}
