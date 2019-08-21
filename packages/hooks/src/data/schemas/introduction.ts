import { RxJsonSchema } from 'rxdb';

export interface Introduction {
  id: string;
  channel: string;
  fingerprint: string;
  name: string;
  sender: string;
}

const schema: RxJsonSchema<Introduction> = {
  title: 'Introduction',
  version: 0,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    channel: {
      type: 'string',
      index: true,
    },
    fingerprint: {
      type: 'string',
      index: true,
    },
    name: {
      type: 'string',
    },
    sender: {
      type: 'string',
    },
  },
};

export default schema;
