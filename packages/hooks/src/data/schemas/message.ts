import { RxJsonSchema } from 'rxdb';

export interface BaseMessage {
  id: string;
  received: number;
  channel: string;
  sender?: string;
}

export interface TextMessage {
  type: 'text'
  message: string;
}

export interface ErrorMessage {
  type: 'error'
  message: string;
}

export interface AddMemberMessage {
  type: 'add-member'
  key: string;
}

export interface RemoveMemberMessage {
  type: 'remove-member'
  key: string;
}

export type Message = (
  TextMessage
  | ErrorMessage
  | AddMemberMessage
  | RemoveMemberMessage
) & BaseMessage;

const schema: RxJsonSchema<Message> = {
  title: 'Message',
  version: 0,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    type: {
      type: 'string',
    },
    received: {
      type: 'number',
      index: true,
    },
    channel: {
      type: 'string',
    },
    sender: {
      type: 'string',
    },
    message: {
      type: 'string',
    },
    key: {
      type: 'string',
    },
  },
};

export default schema;
