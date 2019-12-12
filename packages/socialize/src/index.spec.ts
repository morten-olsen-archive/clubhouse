import { expect } from 'chai';
import { Channel } from '@morten-olsen/clubhouse-protocol';
import { createEnv, EnvType } from './helpers/test';
import socialize, { BuildIns, fromInvite } from './index';

const createConfig = (init: any = undefined) => {
  let config: any = init;
  return {
    getConfig: async () => config,
    setConfig: async (newConfig: any) => { config = newConfig; },
  };
};

describe('socialize', () => {
  let env: EnvType;
  const socials: ReturnType<typeof socialize>[] = [];
  const rules = new BuildIns();
  const messages: any[][] = [];

  before(async () => {
    env = await createEnv(3);
  });

  it('should be able to socialize a channel', async () => {
    const channel = await Channel.create(
      env.users[0].identity,
      env.keyring,
      env.transporter,
      env.users[0].getConfig,
      env.users[0].setConfig,
    );
    const { getConfig, setConfig } = createConfig({
      members: [
        env.users[0].publicKey,
        env.users[1].publicKey,
      ],
      data: {},
      ruleName: 'anarchyV1',
    });
    const social = socialize({
      channel,
      getConfig,
      setConfig,
      rules,
    });
    const messageList: any[] = [];
    messages.push(messageList);
    social.subscribe((message) => {
      messageList.push(message);
    });
    socials.push(social);
  });

  it('should be able to invite user', async () => {
    const invite = await socials[0].invite(env.users[1].publicKey);
    const { getConfig, setConfig } = createConfig();
    const { social } = await fromInvite(
      invite,
      env.users[1].identity,
      env.keyring,
      env.transporter,
      env.users[1].getConfig,
      env.users[1].setConfig,
      getConfig,
      setConfig,
      rules,
    );
    const messageList: any[] = [];
    messages.push(messageList);
    social.subscribe((message) => {
      messageList.push(message);
    });
    socials.push(social);
  });

  it('should be able to send a message', async () => {
    await socials[0].send('hello');
    await socials[1].update();
    expect(messages[0]).to.have.length(1);
    expect(messages[1]).to.have.length(1);
  });

  it('should be able to end', () => {
    socials.forEach((s) => s.destroy());
  });
});
