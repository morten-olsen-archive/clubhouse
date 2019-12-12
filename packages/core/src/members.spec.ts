import { expect } from 'chai';
import * as members from './members';
import { getTestUsers } from './helpers/test';

describe('members', () => {
  it('should be able to encrypt for self', async () => {
    const [user1] = await getTestUsers();
    const encrypted = await members.encrypt('foo', user1.priv, [user1.pub]);
    const decrypted = await members.decrypt(encrypted, [user1.pub], user1.priv);
    expect(decrypted.message).to.be.eq('foo');
    expect(decrypted.signatures[0].valid).to.be.eq(true);
  });

  it('should be able to test signing', async () => {
    const [user1, user2] = await getTestUsers();
    const encrypted = await members.encrypt('foo', user1.priv, [user2.pub]);
    const decrypted = await members.decrypt(encrypted, [user2.pub], user2.priv);
    expect(decrypted.message).to.be.eq('foo');
    expect(decrypted.signatures[0].valid).to.be.eq(null);
  });

  it('should be able to encrypt for multible users', async () => {
    const [user1, user2, user3, user4] = await getTestUsers();
    const encrypted = await members.encrypt('foo', user1.priv, [user2.pub, user3.pub]);
    const decrypted1 = await members.decrypt(encrypted, [user3.pub, user2.pub, user1.pub], user2.priv);
    expect(decrypted1.message).to.be.eq('foo');
    expect(decrypted1.signatures[0].valid).to.be.eq(true);
    const decrypted2 = await members.decrypt(encrypted, [user3.pub, user2.pub, user1.pub], user3.priv);
    expect(decrypted2.message).to.be.eq('foo');
    expect(decrypted2.signatures[0].valid).to.be.eq(true);

    try {
      await members.decrypt(encrypted, [user1.pub], user4.priv);
      throw 'user should not be allowed'
    } catch (err) {
      expect(err).to.not.equal('user should not be allowed');
    }
  });

  it('should be able to find sender', async () => {
    const [user1, user2, user3, user4] = await getTestUsers();
    const encrypted = await members.encrypt('foo', user1.priv, [user2.pub, user3.pub]);
    const decrypted = await members.decrypt(encrypted, [user1.pub, user2.pub, user3.pub, user4.pub], user2.priv);
    expect(decrypted.receivers).to.have.length(2)
    expect(decrypted.receivers.map(m => m.fingerprint)).to.eql([
      user2.priv.getFingerprint(),
      user3.priv.getFingerprint(),
    ]);
    expect(decrypted.sender.fingerprint).to.eql(user1.priv.getFingerprint());
  });
});