import React from 'react';
import { storiesOf } from '@storybook/react';
import ReverseList from '../../layouts/ReverseList';
import Text from './Text';
import MemberAdded from './MemberAdded';
import System from './System';

storiesOf('layouts/messages', module)
  .add('Text', () => (
    <ReverseList style={{top: 0, left: 0, right: 0, bottom: 0, position: 'fixed'}}>
      <Text
        message="Hello Bob, how are you doing?"
        received={new Date()}
        color="#2ecc71"
        sender={{
          name: 'Alice',
        }}
      />
      <System
        message="Could not decrypt message"
        icon="🔒🤯"
      />
      <Text
        message="I'm doing fine, thank you Alice, what about you?"
        received={new Date()}
        self
        sender={{
          name: 'Bob',
        }}
      />
      <MemberAdded
        name="Charlie"
        sender={{
          name: "Bob",
        }}
        onDownloadInvite={() => {}}
      />
      <Text
        message="I just bought a really cool dog 🐶"
        received={new Date()}
        color="#2ecc71"
        sender={{
          name: 'Alice',
        }}
      />
      <Text
        message="Hey, just wanted to say... well... hey!"
        received={new Date()}
        color="#e67e22"
        sender={{
          name: 'Charlie',
        }}
      />
    </ReverseList>
  ));
