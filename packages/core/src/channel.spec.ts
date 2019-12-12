import { expect } from 'chai';
import * as channel from './channel';
import { createTransporter } from './helpers/test';
import ChannelConfig from './types/ChannelConfig';

const getChannel = (): ChannelConfig => ({
  keys: {
    nextId: 'foo',
    nextIdKey: 'baz',
    nextChannelKey: 'bar',
  },
});

describe('channel', () => {
  it('should be able to generate config', async () => {
    const config = await channel.createConfig();
    expect(typeof config.keys.nextChannelKey).to.eql('string');
    expect(typeof config.keys.nextId).to.eql('string');
    expect(typeof config.keys.nextIdKey).to.eql('string');
  });

  it('should be able to encrypt/decrypt', async () => {
    const encrypted = await channel.encrypt('foo', 'bar');
    const decrypted = await channel.decrypt(encrypted, 'bar');
    expect(decrypted).to.be.eq('foo');
  });

  it('should be able to get 0 packages', async () => {
    const transporter = createTransporter();
    const initConfig = getChannel();
    const messages = await channel.getPackages(initConfig, transporter);
    expect(messages.newConfig.keys.nextId).to.be.eq('foo');
    expect(messages.newConfig.keys.nextChannelKey).to.be.eq('bar');
    expect(messages.newConfig.keys.nextIdKey).to.be.eq('baz');
    expect(messages.pkgs).to.have.lengthOf(0);
  });

  it('should be able to add package', async () => {
    const transporter = createTransporter();
    const initConfig = getChannel();
    const messages = await channel.send('hello', initConfig, transporter);
    expect(messages.newConfig.keys.nextId).to.be.eq('fooa');
    expect(messages.newConfig.keys.nextChannelKey).to.be.eq('bara');
    expect(messages.newConfig.keys.nextIdKey).to.be.eq('baza');
    expect(messages.pkgs).to.have.lengthOf(1);
    expect(messages.pkgs).to.be.eql(['hello']);
  });

  it('should be able to get multible package', async () => {
    const transporter = createTransporter();
    const initConfig = getChannel();
    const messages1 = await channel.send('hello1', initConfig, transporter);
    const messages2 = await channel.send('hello2', messages1.newConfig, transporter);
    const messages3 = await channel.send('hello3', messages2.newConfig, transporter);
    await channel.send('hello4', messages3.newConfig, transporter);

    const messages = await channel.getPackages(initConfig, transporter);
    expect(messages.newConfig.keys.nextId).to.be.eq('fooaaaa');
    expect(messages.newConfig.keys.nextChannelKey).to.be.eq('baraaaa');
    expect(messages.newConfig.keys.nextIdKey).to.be.eq('bazaaaa');
    expect(messages.pkgs).to.have.lengthOf(4);
    expect(messages.pkgs).to.be.eql(['hello1', 'hello2', 'hello3', 'hello4']);
  });
});
