import React from 'react';
import { storiesOf } from '@storybook/react';
import * as typography from '.';

storiesOf('typography', module)
  .add('Texts', () => {
    const names = Object.keys(typography);
    return (
      <>
        {names.map((name) => {
          const Component = (typography as any)[name];

          return (
            <Component>{name}</Component>
          )
        })}
      </>
    );
  });