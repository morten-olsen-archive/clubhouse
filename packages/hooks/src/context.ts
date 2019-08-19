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
  createChannel: (identity: string, name: string) => Promise<any>;
  createIdentity: (name: string) => Promise<any>;
}

const context = createContext<ContextType>({
  createChannel: async () => {},
  createIdentity: async () => {},
});

export default context;
