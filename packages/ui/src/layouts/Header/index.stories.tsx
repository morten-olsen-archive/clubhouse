import React, { useState, FunctionComponent } from 'react';
import { storiesOf } from '@storybook/react';
import Header from '.';

const WithData: FunctionComponent = () => {
  const [selected, setSelected] = useState<string>();
  return (
    <>
      <Header
        selectedIdentity={selected}
        identities={[{
          id: 'bob',
          name: 'Bob'
        }, {
          id: 'alice',
          name: 'Alice'
        }]}
        onIdentitySelect={setSelected}
      />
      hello
    </>
  );
}

storiesOf('layouts/Header', module)
  .add('Not logged in', () => (
    <Header
    />
  ))
  .add('Logged in', () => <WithData />);
