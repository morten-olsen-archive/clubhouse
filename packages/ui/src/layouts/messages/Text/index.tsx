import React, {FunctionComponent} from 'react';
import styled from 'styled-components';
import { Body, Label, Link } from '../../../typography';

const Wrapper = styled.div<{
  self: boolean,
}>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.self ? 'flex-end' : 'flex-start')};
  margin: 10px 15px;
`;

const Bubble = styled.div<{ color: string }>`
  background: ${(props) => props.color};
  color: #fff;
  border-radius: 15px;
  padding: 5px 15px;
  display: inline-block;
`;

const Sender = styled.div`
  display: flex;
  align-items: center;
`;

export interface Props {
  message: string;
  received: Date;
  self?: boolean;
  color?: string;
  sender: {
    name: string;
  }
}

const TextMessage: FunctionComponent<Props> = ({
  message,
  sender,
  color = '#9b59b6',
  received,
  self = false,
}) => (
  <Wrapper self={self}>
    <Bubble color={color}>
      <Body>{message}</Body>
    </Bubble>
    <Sender>
      <Label>
        <time>2 hours ago</time>&nbsp;
        by&nbsp;
        <Link>{sender.name}</Link> 
      </Label>
    </Sender>
  </Wrapper>
);

export default TextMessage;
