import React, { FunctionComponent } from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line
import Header from '.';

const WithData: FunctionComponent = () => (
  <>
    <Header />
    hello
  </>
);

storiesOf('layouts/Header', module)
  .add('Not logged in', () => (
    <Header />
  ))
  .add('Logged in', () => <WithData />);
