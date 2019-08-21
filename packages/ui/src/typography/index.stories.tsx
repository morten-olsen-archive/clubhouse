import React from 'react';
import { storiesOf } from '@storybook/react';
import * as texts from './index';

storiesOf('typography', module)
  .add('Texts', () => {
    const keys = Object.keys(texts);
    return (
      <>
        {keys.map((key) => {
          const Component = (texts as any)[key];
          return <Component key={key}>{key}</Component>;
        })}
      </>
    );
  });
