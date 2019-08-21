import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from './index';

storiesOf('base/Button', module)
  .add('Primary', () => {
    return (
      <Button title="Hello" />
    );
  });