import MessageStore from '.';

class TestStore implements MessageStore {
  data: {[name: string]: string};
  signals: string[];

  constructor() {
    this.data = {};
    this.signals = [];
  }

  async has(signal: string) {
    return this.signals.includes(signal);
  }

  async get(id: string) {
    return this.data[id];
  }

  async set(id: string, value: string) {
    this.data[id] = value;
  }
}

export default TestStore;
