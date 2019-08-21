import { Context } from 'react';
import { Channel, Transporter } from 'clubhouse-protocol';
import { DBType } from '../createDB';
import { Channel as DBChannel } from '../schemas/channel';
import context from '../../context';
import { RxDocument } from 'rxdb';

type ContextType = typeof context extends Context<infer U> ? U : never;
type IdentityType = Exclude<ContextType['identities'], undefined>;

export const setupChannel = async (data: RxDocument<DBChannel>, channel: Channel, db: DBType) => {
  channel.on('updated', async (messages) => {
    const updateKey = await channel.pack();
    await Promise.all(messages.map(async (message) => {
      console.log('c', message, channel);
      if (message instanceof Error) {
        return;
      }
      if (message.data.type === 'introduction') {
        await db.introductions.insert({
          id: message.id,
          channel: data.id,
          sender: message.sender.fingerprint,
          fingerprint: message.sender.fingerprint,
          name: message.data.message,
        });
      }
      await db.messages.insert({
        id: message.id,
        received: new Date().getTime(),
        channel: data.id,
        type: message.data.type,
        sender: message.sender.fingerprint,
        message: message.data.message,
        key: message.data.key,
      });
    }));
    await data.update({
      $set: {
        key: updateKey,
      },
    });
  });
}

const expandChannels = async (
  db: DBType,
  identities: IdentityType,
  transporter: Transporter,
) => {
  const channelData = await db.channels.find().exec();
  const tasks = channelData.map(async (data) => {
    const resultInner = identities.find((i) => i.id === data.identity);
    const { identity } = resultInner as Exclude<typeof resultInner, undefined>;
    if (!identity) {
      throw new Error('channel identity not found');
    }
    const channel = await Channel.load(identity, data.key, transporter);
    await setupChannel(data, channel, db);
    return {
      id: data.id,
      name: data.name,
      identity: data.identity,
      channel,
    };
  });
  const result = await Promise.all(tasks);
  return result;
};

export default expandChannels;
