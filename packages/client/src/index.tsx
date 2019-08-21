import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'clubhouse-hooks';
import * as RxDB from 'rxdb';
import createTransporter from 'clubhouse-transporter-memory';
import App from './containers/App';

const memoryAdapter = require('pouchdb-adapter-memory'); // eslint-disable-line
RxDB.plugin(memoryAdapter);

const root = document.createElement('div');
document.body.append(root);
document.documentElement.style.height = '100%';
document.body.style.height = '100%';
document.body.style.margin = '0';
root.style.height = '100%';

const { Transporter } = createTransporter();
const transporter = new Transporter();

const Loader = () => <div>loader</div>;

render(
  <Provider
    adapter="memory"
    transporter={transporter}
    loader={<Loader />}
  >
    <App />
  </Provider>,
  root,
);
