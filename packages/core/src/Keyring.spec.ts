import { expect } from 'chai';
import { getTestUsers } from './helpers/test';
import Keyring from './Keyring';

describe('core/Keyring', () => {
  it('should start empty', async () => {
    const keyring = new Keyring();
    expect(keyring.toPublicKeys()).to.have.lengthOf(0);
  });

  it('should be able to add keys', async () => {
    const [user1, user2] = await getTestUsers();
    const keyring = new Keyring();
    await keyring.addKeys([
      user1.pub,
      user2.pub,
    ]);
    expect(keyring.toPublicKeys()).to.have.lengthOf(2);
    expect(keyring.toPublicKeys()).to.eql([
      user1.pub,
      user2.pub,
    ]);
  });
});
