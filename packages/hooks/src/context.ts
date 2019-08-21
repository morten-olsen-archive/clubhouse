import { createContext } from 'react';
import { Channel, Identity } from 'clubhouse-protocol';
import { DBType } from './data/createDB';

interface ContextType {
  db?: DBType;
  error?: Error;
  identities?: {
    id: string;
    name: string;
    identity: Identity;
  }[];
  channels?: {
    id: string;
    name: string;
    identity: string;
    channel: Channel;
  }[];
  createChannel: (identity: string, name: string) => Promise<string>;
  createIdentity: (name: string) => Promise<any>;
  addChannel: (name: string, identity: string, invitation: string, sender: string) => Promise<void>;
}

const context = createContext<ContextType>({
  createChannel: async () => '',
  createIdentity: async () => {},
  addChannel: async () => {},
});

export default context;
