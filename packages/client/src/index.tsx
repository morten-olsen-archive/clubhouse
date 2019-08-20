import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'clubhouse-hooks';
import * as RxDB from 'rxdb';
const memoryAdapter = require('pouchdb-adapter-memory');
RxDB.plugin(memoryAdapter);

const root = document.createElement('div');
document.body.append(root);

const Demo = () => {
  return <div>Test</div>;
}

const Loader = () => {
  return <div>loader</div>;
}

render(
  <Provider
    adapter="memory"
    transporter={undefined as any}
    loader={<Loader />}
  >
    <Demo />
  </Provider>,
  root,
);
