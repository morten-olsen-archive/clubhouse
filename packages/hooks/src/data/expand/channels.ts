import { Context } from 'react';
import { Channel, Transporter } from 'clubhouse-protocol';
import { DBType } from '../createDB';
import context from '../../context';

type ContextType = typeof context extends Context<infer U> ? U : never;
type IdentityType = Exclude<ContextType['identities'], undefined>;

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
    channel.on('updated', async (messages) => {
      const updateKey = await channel.pack();
      await Promise.all(messages.map(async (message: any) => {
        db.messages.insert({
          id: (message as any).id,
          received: new Date().getTime(),
          channel: data.id,
          type: 'text',
          message: JSON.stringify(message),
        });
      }));
      await data.update({
        $set: {
          key: updateKey,
        },
      });
    });
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
