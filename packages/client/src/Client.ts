import { Channel } from '@morten-olsen/clubhouse-protocol';
import { SocialType } from '@morten-olsen/clubhouse-socialize';
import Store from './Store';

interface Social {
  name: string;
  channel: Channel,
  social: SocialType,
}

class Client {
  private store: Store;
  private socials: Social[] = [];

  constructor(store: Store) {
    this.store = store;
  }

  setup = async () => {
    const names = await this.store.getNames();
    const identity = await this.store.getIdentity();
    const socials = await Promise.all(names.map<Promise<Social>>(async (name) => {

    }));
  }
}

export default Client;
