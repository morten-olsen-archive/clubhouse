import * as RxDB from 'rxdb';
import identitySchema from './schemas/identity';
import channelSchema from './schemas/channel';
import messageSchema from './schemas/message';
import introductionSchema from './schemas/introduction';

type GetSchemaType<T> = T extends RxDB.RxJsonSchema<infer U> ? U : never;

const create = async (adapter: string) => {
  const db = await RxDB.create({
    name: 'clubhouseprotocol',
    adapter,
    ignoreDuplicate: true,
  });


  const identities = await db.collection<GetSchemaType<typeof identitySchema>>({
    name: 'identities',
    schema: identitySchema,
  });

  const channels = await db.collection<GetSchemaType<typeof channelSchema>>({
    name: 'channels',
    schema: channelSchema,
  });

  const messages = await db.collection<GetSchemaType<typeof messageSchema>>({
    name: 'messages',
    schema: messageSchema,
  });

  const introductions = await db.collection<GetSchemaType<typeof introductionSchema>>({
    name: 'introductions',
    schema: introductionSchema,
  });

  return {
    db,
    identities,
    channels,
    messages,
    introductions,
  };
};

type GetPromiseType<T> = T extends Promise<infer U> ? U : never;
type DBType = GetPromiseType<ReturnType<typeof create>>;

export {
  DBType,
};

export default create;
