import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useMessages, useIntoductions } from 'clubhouse-hooks';
import styled from 'styled-components';
import renderMessage from './renderMessage';

const Wrapper = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  transform: scale(1, -1);
`;

const Compose = styled.div`
  height: 30px;
  background: blue;
  display: flex;
`;

const Input = styled.input`
  flex: 1;
`;

const Message = styled.div`
  transform: scale(1, -1);
`;

const MessageList = withRouter(({
  match,
  history,
}) => {
  const channelId = match.params.channel;
  const [text, setText] = useState('');
  const { messages, channel, identity } = useMessages(channelId);
  const { getInfo } = useIntoductions(channelId);
  if (!channel || !messages || !identity) {
    return <div>Select channel</div>;
  }
  return (
    <Wrapper>
      <div>
        {channel.channel.members.all.map((member) => (
          <span key={member.fingerprint}>{getInfo(member.fingerprint)}</span>
        ))}
      </div>
      <Messages>
        {messages.map((message) => (
          <Message key={message.id}>
            {renderMessage(message, getInfo, identity.identity, channel.channel)}
          </Message>
        ))}
      </Messages>
      <Compose>
        <Input value={text} onChange={(evt) => setText(evt.target.value)} />
        <button
          type="submit"
          onClick={() => {
            channel.channel.send({
              type: 'text',
              message: text,
            }).then(() => {
              setText('');
            });
          }}
        >
          Send
        </button>
        <button
          type="submit"
          onClick={() => {
            channel.channel.send({
              type: 'introduction',
              message: text,
            }).then(() => {
              setText('');
            });
          }}
        >
          Introduce
        </button>
        <button
          type="submit"
          onClick={() => {
            history.push(`/channel/${channelId}/invite`);
          }}
        >
          Invite
        </button>
      </Compose>
    </Wrapper>
  );
});

export default MessageList;
