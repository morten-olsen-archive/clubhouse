import * as openpgp from 'openpgp';
import Transporter from '../types/Transporter';

export const createTransporter = (): Transporter => {
  const data: {[id: string]: string} = {};
  return {
    get: async (id) => data[id],
    exists: async (id) => !!data[id],
    set: async (id, value) => { data[id] = value },
  };
};

const createTestUsers = async () => {
  const keys = await Promise.all(new Array(5).fill(undefined).map((a, i) => openpgp.generateKey({
    userIds: [{ name: `User ${i}`, email:`user${i}@example.com` }],
    curve: 'ed25519',
  })));

  return keys.map(k => ({
    priv: k.key,
    pub: k.publicKeyArmored,
  }));
};

const userPromise = createTestUsers();

export const getTestUsers = () => userPromise;