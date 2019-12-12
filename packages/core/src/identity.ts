import * as openpgp from 'openpgp';

export const create = async () => {
  const { key } = await openpgp.generateKey({
    userIds: [{ name: 'User', email: 'user@example.com' }],
    curve: 'ed25519',
  });
  return key;
};
