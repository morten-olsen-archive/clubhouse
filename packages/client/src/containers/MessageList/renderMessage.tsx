import React from 'react';
import styled from "styled-components";
import { Identity, Channel } from 'clubhouse-protocol';
import { download } from '../../helpers/document';


const renderMessage = (
  message: any,
  getInfo: (name: string) => string,
  identity: Identity,
  channel: Channel,
) => {
  switch (message.type) {
    case 'text': {
      return `${getInfo(message.sender)}: ${message.message}`;
    }
    case 'ADD_MEMBER':
      return (
        <>
          Added member
          <button onClick={async () => {
            const newIdentity = await Identity.open(message.key);
            const pack = await channel.pack(newIdentity);
            download(JSON.stringify({
              invite: pack,
              sender: identity.publicKey.armor(),
            }), 'octo/any');
          }}>
            Download invitation
          </button>
        </>
      )
    default: {
      return null;
    }
  }
}

export default renderMessage;