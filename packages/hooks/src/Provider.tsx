import React, {
  FunctionComponent,
  useState,
  Context,
  useEffect,
  ReactNode,
} from 'react';
import uuid from 'uuid/v4';
import { Identity, Channel, Transporter } from 'clubhouse-protocol';
import context from './context';
import createDB, { DBType } from './data/createDB';
import expandIdentites from './data/expand/identities';
import expandChannels, { setupChannel } from './data/expand/channels';

const ContextProvider = context.Provider;

type ContextType = typeof context extends Context<infer U> ? U : never;
type IdentityType = ContextType['identities'];
type ChannelType = ContextType['channels'];
type ErrorType = ContextType['error'];
type CreateChannelType = ContextType['createChannel'];
type AddChannelType = ContextType['addChannel'];

interface Props {
  adapter: string;
  children: ReactNode;
  transporter: Transporter;
  loader?: ReactNode;
  onReady?: (context: ContextType) => any;
}

const Provider: FunctionComponent<Props> = ({
  children,
  transporter,
  loader = null,
  adapter,
  onReady,
}) => {
  const [loading, setLoading] = useState(true);
  const [db, setDB] = useState<DBType | undefined>();
  const [identities, setIdentities] = useState<IdentityType>();
  const [channels, setChannels] = useState<ChannelType>();
  const [error, setError] = useState<ErrorType>();

  const createChannel: CreateChannelType = async (identityId, name) => {
    if (!db || !identities) {
      throw Error('db not ready');
    }
    const identity = identities.find((i) => i.id === identityId);
    if (!identity) {
      throw new Error('Identity not found');
    }
    const id = uuid();
    const key = await Channel.create(identity.identity, []);
    const channel = await Channel.load(identity.identity, key, transporter);
    const data = await db.channels.insert({
      id,
      name,
      identity: identityId,
      key,
      restoreKey: key,
    });
    setupChannel(data, channel, db);
    setChannels([
      ...(channels || []),
      {
        id,
        name,
        identity: identityId,
        channel,
      },
    ]);
    return id;
  };

  const addChannel: AddChannelType = async (name, identityId, invitation, senderKey) => {
    if (!db || !identities) {
      throw Error('db not ready');
    }
    const identity = identities.find((i) => i.id === identityId);
    if (!identity) {
      throw new Error('Identity not found');
    }
    const id = uuid();
    const sender = await Identity.open(senderKey);
    const channel = await Channel.load(identity.identity, invitation, transporter, sender);
    const key = await channel.pack();
    const data = await db.channels.insert({
      id,
      name,
      identity: identityId,
      key,
      restoreKey: key,
    });
    setupChannel(data, channel, db);
    setChannels([
      ...(channels || []),
      {
        id,
        name,
        identity: identityId,
        channel,
      },
    ]);
  };

  const createIdentity = async (name: string) => {
    if (!db) {
      throw Error('db not ready');
    }
    const id = uuid();
    const key = await Identity.create({ name: 'John Doe', email: 'john.doe@example.com' });
    const identity = await Identity.open(key);
    expandChannels(db, identities as Exclude<typeof identities, undefined>, transporter);
    setIdentities([
      ...(identities || []),
      {
        id,
        identity,
        name,
      },
    ]);
    await db.identities.insert({
      id,
      name,
      key,
    });
  };

  const contextValues: ContextType = {
    db,
    error,
    identities,
    channels,
    createChannel,
    createIdentity,
    addChannel,
  };

  useEffect(() => {
    createDB(adapter)
      .then(async (nDB) => {
        setDB(nDB);
        const nIdentities = await expandIdentites(nDB);
        setIdentities(nIdentities);

        const nChannels = await expandChannels(nDB, nIdentities, transporter);
        setChannels(nChannels);
        setLoading(false);
        if (onReady) {
          onReady(contextValues);
        }
      })
      .catch((err) => {
        setError(err);
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (identities && identities.length === 0) {
      createIdentity('default');
    }
  }, [identities]);

  return (
    <ContextProvider value={contextValues}>
      {loading ? loader : children}
    </ContextProvider>
  );
};

export default Provider;
