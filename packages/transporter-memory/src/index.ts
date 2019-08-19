import { Transporter } from 'clubhouse-protocol';

const create = () => {
  const data: {[name: string]: string} = {};
  const signals: {[name: string]: (() => void)[]} = {};

  class TestTransporter implements Transporter {
    async get(id: string) {
      return data[id];
    }

    async add(id: string, value: string) {
      data[id] = value;
    }

    async waitForSignal(signal: string) {
      let resolver: () => void = () => {};
      const promise = new Promise<void>((resolve) => {
        resolver = resolve;
      });
      if (!signals[signal]) {
        signals[signal] = [];
      }
      signals[signal].push(resolver);
      return promise;
    }
  }

  return {
    Transporter: TestTransporter as new () => Transporter,
  };
};

export default create;
