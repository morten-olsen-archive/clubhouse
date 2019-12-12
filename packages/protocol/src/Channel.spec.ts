import { expect } from 'chai';
import Channel from './Channel';
import { createEnv } from './helpers/test';

type PromiseType<T> = T extends Promise<infer U> ? U : never;
type EnvType = PromiseType<ReturnType<typeof createEnv>>;

describe('protocol/channel', () => {
  let env: EnvType;
  const channels: Channel[] = [];

  before(async () => {
    env = await createEnv(3);
  });

  it('should be able to send to self', async () => {
    const channel = await Channel.create(
      env.users[0].identity,
      env.keyring,
      env.transporter,
      env.users[0].getConfig,
      env.users[0].setConfig,
    );
    const messages = await channel.send('hello');
    expect(messages).to.have.length(1);
    const [message] = messages;
    expect(message.sender.fingerprint).to.be.eq(env.users[0].identity.getFingerprint());
    expect(message.receivers.map((r) => r.fingerprint)).to.be.eql(
      env.users.map((u) => u.identity.getFingerprint()),
    );
    channels.push(channel);
  });

  it('should be able to invite users', async () => {
    const invite = await channels[0].createInvite(env.users[1].publicKey, 'foo');
    const { channel, data } = await Channel.loadInvite(
      invite,
      env.users[1].identity,
      env.keyring,
      env.transporter,
      env.users[1].getConfig,
      env.users[1].setConfig,
    );
    expect(data).to.be.eq('foo');
    channels.push(channel);
  });

  it('should be able to receive messages after invite', async () => {
    const messages1 = await channels[1].update();
    expect(messages1).to.have.length(0);
    await channels[0].send('hello');
    await channels[0].send('world');
    const messages2 = await channels[1].update();
    expect(messages2).to.have.length(2);
    expect(messages2.map((m) => m.message)).to.be.eql([
      'hello',
      'world',
    ]);
    expect(messages2.map((m) => m.sender.fingerprint)).to.be.eql([
      env.users[0].identity.getFingerprint(),
      env.users[0].identity.getFingerprint(),
    ]);
  });
});
